import { Request, Response } from 'express';
import { prisma } from '../../index';
import { createSectionSchema, updateSectionSchema } from './section.schema';

export const getSectionsBySubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { subjectId } = req.params;
        const sections = await prisma.section.findMany({
            where: { subject_id: BigInt(req.params.subjectId as string) },
            orderBy: { order_index: 'asc' },
            include: { videos: { orderBy: { order_index: 'asc' } } }
        });
        res.json(sections);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch sections' });
    }
};

export const createSection = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = createSectionSchema.parse(req.body);
        const section = await prisma.section.create({ 
            data: {
                title: data.title,
                order_index: data.order_index,
                subject_id: BigInt(data.subject_id)
            }
        });
        res.status(201).json(section);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        // Handle unique constraint error
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Section order_index must be unique per subject' });
            return;
        }
        res.status(400).json({ error: 'Failed to create section' });
    }
};

export const updateSection = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = updateSectionSchema.parse(req.body);
        const section = await prisma.section.update({
            where: { id: BigInt(req.params.id as string) },
            data: {
                title: data.title,
                order_index: data.order_index,
                ...(data.subject_id && { subject_id: BigInt(data.subject_id) })
            }
        });
        res.json(section);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        res.status(400).json({ error: 'Failed to update section' });
    }
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.section.delete({ where: { id: BigInt(req.params.id as string) } });
        res.json({ message: 'Section deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to delete section' });
    }
};
