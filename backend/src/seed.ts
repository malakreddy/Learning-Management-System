import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing data...');
  await prisma.videoProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.subject.deleteMany({});

  const courses = [
    {
      title: "Python 🐍 Full Course for absolute beginners",
      slug: "python-full-course",
      description: "A comprehensive guide to Python programming, covering everything from variables to advanced object-oriented programming.",
      videoId: "XKHEtdqhLK8",
      duration: 43200 // Approx 12 hours
    },
    {
      title: "Gen AI + Full Stack Web Development",
      slug: "gen-ai-full-stack",
      description: "Build a modern web application integrating Gemini AI with React, Node.js, and JWT authentication.",
      videoId: "zG3hNL08Dro",
      duration: 3600
    },
    {
      title: "Full Stack Web Development (2025 Edition)",
      slug: "full-stack-2025",
      description: "The complete 2025 Roadmap to becoming a Full Stack Developer. Master HTML, CSS, JS, React, and Backend.",
      videoId: "F4zr1aMevB4",
      duration: 36000
    },
    {
      title: "Data Science & AI: Complete 12-Hour Mastery",
      slug: "data-science-ai-mastery",
      description: "Learn Data Science from scratch. Covers Statistics, Machine Learning, and AI integration for beginners.",
      videoId: "xPh5ihBWang",
      duration: 43200
    },
    {
      title: "The Ultimate AntiGravity Masterclass",
      slug: "antigravity-masterclass",
      description: "Deep dive into Advanced Agentic Coding and AI-driven development workflows. Master the tools of the future.",
      videoId: "mvHGl6zEA3w",
      duration: 10800
    },
    {
      title: "Claude Code Full Course: Build & Sell",
      slug: "claude-code-full-course",
      description: "Learn how to build commercial-grade applications using Claude Code and Anthropic's latest models.",
      videoId: "QoQBzR1NIqI",
      duration: 14400
    }
  ];

  for (const course of courses) {
    await prisma.subject.create({
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        is_published: true,
        sections: {
          create: [
            {
              title: "Main Curriculum",
              order_index: 1,
              videos: {
                create: [
                  {
                    title: "Welcome to " + course.title.split(' ')[0],
                    youtube_video_id: course.videoId,
                    order_index: 1,
                    duration_seconds: course.duration
                  }
                ]
              }
            }
          ]
        }
      }
    });
    console.log(`Successfully seeded: ${course.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
