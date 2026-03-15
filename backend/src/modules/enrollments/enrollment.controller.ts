import { Request, Response } from 'express';
import { prisma } from '../../index';
import { createEnrollmentSchema } from './enrollment.schema';
import { AuthRequest } from '../../middleware/auth.middleware';

export const enrollUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const data = createEnrollmentSchema.parse(req.body);
        
        // Check if subject exists
        const subject = await prisma.subject.findUnique({
            where: { id: BigInt(data.subject_id) }
        });

        if (!subject) {
            res.status(404).json({ error: 'Subject not found' });
            return;
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                user_id: BigInt(req.user.userId),
                subject_id: BigInt(data.subject_id)
            }
        });

        res.status(201).json(enrollment);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'User is already enrolled in this subject' });
            return;
        }
        res.status(400).json({ error: 'Failed to enroll user' });
    }
};

export const getUserEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = BigInt(req.user.userId);
        console.log(`[DEBUG] Fetching enrollments for user ${userId}`);
        const enrollments = await prisma.enrollment.findMany({
            where: { user_id: userId },
            include: { 
                subject: {
                    include: {
                        sections: {
                            include: {
                                videos: true
                            }
                        }
                    }
                } 
            }
        });

        const enrollmentsWithProgress = await Promise.all(enrollments.map(async (e) => {
            // Get all video IDs for this subject
            const videoIds = e.subject.sections.flatMap(section => 
                section.videos.map(video => video.id)
            );

            const totalVideos = videoIds.length;

            // Get count of completed videos for this user and subject
            const completedCount = await prisma.videoProgress.count({
                where: {
                    user_id: userId,
                    video_id: { in: videoIds },
                    is_completed: true
                }
            });

            const progress = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

            // Convert Prisma object to plain object to ensure all fields spread correctly
            const enrollmentObj = JSON.parse(JSON.stringify(e));

            console.log(`[DEBUG] Subject: ${e.subject.title}, Progress: ${progress}%`);
            return {
                id: e.id.toString(),
                user_id: e.user_id.toString(),
                subject_id: e.subject_id.toString(),
                created_at: e.created_at,
                subject: enrollmentObj.subject,
                progress,
                totalVideos,
                completedVideos: completedCount,
                _is_verified_v2: true
            };
        }));

        console.log(`[DEBUG] Returning ${enrollmentsWithProgress.length} enrollments with progress data`);

        res.json(enrollmentsWithProgress);
    } catch (error: any) {
        console.error("Failed to fetch enrollments", error);
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
};

export const checkEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { subjectId } = req.params;

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                user_id_subject_id: {
                    user_id: BigInt(req.user.userId),
                    subject_id: BigInt(subjectId as string)
                }
            }
        });

        res.json({ isEnrolled: !!enrollment });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to check enrollment' });
    }
};
