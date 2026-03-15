"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { BookOpen, CheckCircle2, Circle, PlayCircle, Loader2 } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface Video {
  id: string;
  title: string;
  youtube_video_id: string;
  description: string;
  duration_seconds: number;
}

interface Section {
  id: string;
  title: string;
  videos: Video[];
}

interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string;
  sections: Section[];
}

interface ProgressMap {
  [videoId: string]: {
    last_position_seconds: number;
    is_completed: boolean;
  };
}

export default function CoursePage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // YouTube Player Ref
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // 1. Fetch Subject Details
        const subjectRes = await api.get(`/subjects/${slug}`);
        setSubject(subjectRes.data);

        // 2. If authenticated, check enrollment and progress
        if (isAuthenticated) {
          const enrollRes = await api.get(`/enrollments/check/${subjectRes.data.id}`);
          setIsEnrolled(enrollRes.data.isEnrolled);

          if (enrollRes.data.isEnrolled) {
            // Fetch progress for all videos (In a real app, backend should ideally return this aggregated)
            // For now, we'll fetch individually for the active section or all if small
            const progressReqs = subjectRes.data.sections.flatMap((sec: Section) => 
               sec.videos.map((vid: Video) => api.get(`/videos/${vid.id}/progress`))
            );
            
            const progressRes = await Promise.all(progressReqs);
            const newProgressMap: ProgressMap = {};
            
            // Map the responses back to video IDs
            let i = 0;
            subjectRes.data.sections.forEach((sec: Section) => {
               sec.videos.forEach((vid: Video) => {
                  newProgressMap[vid.id] = progressRes[i].data;
                  i++;
               });
            });
            setProgressMap(newProgressMap);
            
            // Set first video as active by default if none selected
            if (subjectRes.data.sections.length > 0 && subjectRes.data.sections[0].videos.length > 0) {
              setActiveVideo(subjectRes.data.sections[0].videos[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchCourseData();
    }
  }, [slug, isAuthenticated, authLoading]);

  // Handle Enrollment
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!subject) return;

    setEnrollLoading(true);
    try {
      await api.post("/enrollments", { subject_id: parseInt(subject.id) });
      setIsEnrolled(true);
      // Set first video active
      if (subject.sections.length > 0 && subject.sections[0].videos.length > 0) {
        setActiveVideo(subject.sections[0].videos[0]);
      }
    } catch (err) {
      console.error("Failed to enroll", err);
    } finally {
      setEnrollLoading(false);
    }
  };

  // Setup YouTube iframe API dynamically
  useEffect(() => {
    if (isEnrolled && activeVideo && !window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (isEnrolled && activeVideo && window.YT) {
      initPlayer();
    }
    
    return () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeVideo, isEnrolled]);

  const initPlayer = () => {
      if (playerRef.current) {
          playerRef.current.destroy();
      }

      if (!activeVideo) return;

      const startSeconds = progressMap[activeVideo.id]?.last_position_seconds || 0;

      playerRef.current = new window.YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: activeVideo.youtube_video_id,
          playerVars: {
              autoplay: 1,
              start: startSeconds,
              modestbranding: 1,
              rel: 0
          },
          events: {
              onStateChange: onPlayerStateChange
          }
      });
  };

  const onPlayerStateChange = (event: any) => {
      // Clear existing interval
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      if (event.data === window.YT.PlayerState.PLAYING) {
          // Track progress every 5 seconds
          progressIntervalRef.current = setInterval(saveProgress, 5000);
      } else if (event.data === window.YT.PlayerState.ENDED) {
          markCompleted();
      } else if (event.data === window.YT.PlayerState.PAUSED) {
          saveProgress();
      }
  };

  const saveProgress = async () => {
      if (!activeVideo || !playerRef.current || !playerRef.current.getCurrentTime) return;
      
      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      
      try {
          await api.post(`/videos/${activeVideo.id}/progress`, {
              last_position_seconds: currentTime
          });
          
          setProgressMap(prev => ({
              ...prev,
              [activeVideo.id]: {
                  ...prev[activeVideo.id],
                  last_position_seconds: currentTime
              }
          }));
      } catch(e) {
          console.error("Progress save failed");
      }
  };

  const markCompleted = async () => {
      if (!activeVideo) return;
      
      try {
          await api.post(`/videos/${activeVideo.id}/progress`, {
              is_completed: true
          });
          
          setProgressMap(prev => ({
              ...prev,
              [activeVideo.id]: {
                  ...prev[activeVideo.id],
                  is_completed: true
              }
          }));
      } catch(e) {
          console.error("Completion mark failed");
      }
  };


  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex flex-col h-screen items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link href="/" className="text-primary hover:underline">Return to catalog</Link>
      </div>
    );
  }

  // View: Not Enrolled
  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card h-16 flex items-center px-4 md:px-8">
            <Link href="/" className="font-bold flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                &larr; Back to Catalog
            </Link>
        </header>
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-lg">
                <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">{subject.title}</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {subject.description}
                </p>
                <div className="bg-secondary/30 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                    <h3 className="font-semibold mb-4 border-b border-border pb-2">Course Curriculum</h3>
                    <ul className="space-y-3">
                        {subject.sections.map(sec => (
                            <li key={sec.id} className="text-sm text-foreground flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                                {sec.title} <span className="text-muted-foreground ml-auto">{sec.videos.length} videos</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <button 
                    onClick={handleEnroll}
                    disabled={enrollLoading}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                    {enrollLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Enroll Now - Free"}
                </button>
            </div>
        </div>
      </div>
    );
  }

  // View: Enrolled & Learning
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mr-2">
                &larr; Dashboard
            </Link>
            <h1 className="font-semibold text-lg hidden md:block border-l border-border pl-4">{subject.title}</h1>
        </div>
        <div>
           {activeVideo && <span className="text-sm text-muted-foreground">{activeVideo.title}</span>}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Video Player Area */}
        <div className="flex-1 flex flex-col bg-black relative">
            {activeVideo ? (
                <div className="flex-1 w-full h-full">
                   <div id="youtube-player" className="w-full h-full absolute inset-0"></div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-white/50">
                    Select a video from the sidebar to begin.
                </div>
            )}
            
            {/* Video Details Container */}
            {activeVideo && (
                <div className="bg-card border-t border-border p-6 shrink-0 z-10">
                    <div className="max-w-4xl">
                        <h2 className="text-2xl font-bold mb-2">{activeVideo.title}</h2>
                        {activeVideo.description && (
                            <p className="text-muted-foreground text-sm">{activeVideo.description}</p>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Right: Curriculum Sidebar */}
        <div className="w-80 lg:w-96 border-l border-border bg-card flex flex-col shrink-0">
            <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg">Course Curriculum</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {subject.sections.map((section, sIdx) => (
                    <div key={section.id} className="border-b border-border">
                        <div className="py-4 px-6 bg-secondary/20">
                            <h3 className="font-medium text-sm text-foreground/80">
                                Section {sIdx + 1}: {section.title}
                            </h3>
                        </div>
                        <div className="flex flex-col">
                            {section.videos.map((video, vIdx) => {
                                const isActive = activeVideo?.id === video.id;
                                const progress = progressMap[video.id];
                                const isCompleted = progress?.is_completed;

                                return (
                                    <button
                                        key={video.id}
                                        onClick={() => setActiveVideo(video)}
                                        className={`flex items-start gap-4 p-4 text-left transition-colors hover:bg-secondary/40 ${
                                            isActive ? 'bg-secondary/50 border-l-2 border-primary' : 'border-l-2 border-transparent'
                                        }`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            ) : isActive ? (
                                                <PlayCircle className="w-5 h-5 text-primary animate-pulse" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-muted-foreground opacity-50" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
                                                {video.title}
                                            </p>
                                            {video.duration_seconds && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {Math.floor(video.duration_seconds / 60)} min
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
