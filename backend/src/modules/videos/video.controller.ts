import { Request, Response } from 'express';
import { prisma } from '../../index';
import { createVideoSchema, updateVideoSchema, updateProgressSchema } from './video.schema';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getVideosBySection = async (req: Request, res: Response): Promise<void> => {
    try {
        const videos = await prisma.video.findMany({
            where: { section_id: BigInt(req.params.sectionId as string) },
            orderBy: { order_index: 'asc' }
        });
        res.json(videos);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};

export const createVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = createVideoSchema.parse(req.body);
        const video = await prisma.video.create({ 
            data: {
                ...data,
                section_id: BigInt(data.section_id)
            }
        });
        res.status(201).json(video);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        res.status(400).json({ error: 'Failed to create video' });
    }
};

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = updateVideoSchema.parse(req.body);
        const video = await prisma.video.update({
            where: { id: BigInt(id as string) },
            data: {
                ...data,
                ...(data.section_id && { section_id: BigInt(data.section_id) })
            }
        });
        res.json(video);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        res.status(400).json({ error: 'Failed to update video' });
    }
};

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.video.delete({ where: { id: BigInt(id as string) } });
        res.json({ message: 'Video deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to delete video' });
    }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { videoId } = req.params;
        const data = updateProgressSchema.parse(req.body);
        
        const isCurrentlyCompleted = data.is_completed === true;

        const progress = await prisma.videoProgress.upsert({
            where: {
                user_id_video_id: {
                    user_id: BigInt(req.user.userId),
                    video_id: BigInt(videoId as string)
                }
            },
            update: {
                ...(data.last_position_seconds !== undefined && { last_position_seconds: data.last_position_seconds }),
                ...(data.is_completed !== undefined && { 
                    is_completed: data.is_completed,
                    completed_at: isCurrentlyCompleted ? new Date() : null
                })
            },
            create: {
                user_id: BigInt(req.user.userId),
                video_id: BigInt(videoId as string),
                last_position_seconds: data.last_position_seconds || 0,
                is_completed: data.is_completed || false,
                completed_at: isCurrentlyCompleted ? new Date() : null
            }
        });

        res.json(progress);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        res.status(400).json({ error: 'Failed to update progress' });
    }
};

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { videoId } = req.params;
        
        const progress = await prisma.videoProgress.findUnique({
            where: {
                user_id_video_id: {
                    user_id: BigInt(req.user.userId),
                    video_id: BigInt(videoId as string)
                }
            }
        });

        res.json(progress || { last_position_seconds: 0, is_completed: false });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
};
