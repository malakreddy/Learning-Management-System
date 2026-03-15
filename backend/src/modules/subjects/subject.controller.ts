import { Request, Response } from 'express';
import { prisma } from '../../index';
import { createSubjectSchema, updateSubjectSchema } from './subject.schema';

export const getAllSubjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                sections: {
                    orderBy: { order_index: 'asc' },
                    include: { videos: { orderBy: { order_index: 'asc' } } }
                }
            }
        });
        res.json(subjects);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
};

export const getSubjectBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const subject = await prisma.subject.findUnique({
            where: { slug: req.params.slug as string },
            include: {
                sections: {
                    orderBy: { order_index: 'asc' },
                    include: { videos: { orderBy: { order_index: 'asc' } } }
                }
            }
        });
        if (!subject) {
            res.status(404).json({ error: 'Subject not found' });
            return;
        }
        res.json(subject);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch subject' });
    }
};

export const createSubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = createSubjectSchema.parse(req.body);
        const subject = await prisma.subject.create({ data });
        res.status(201).json(subject);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        res.status(400).json({ error: 'Failed to create subject' });
    }
};

export const updateSubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = updateSubjectSchema.parse(req.body);
        const subject = await prisma.subject.update({
            where: { id: BigInt(req.params.id as string) },
            data
        });
        res.json(subject);
    } catch (error: any) {
        if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return; }
        res.status(400).json({ error: 'Failed to update subject' });
    }
};

export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.subject.delete({ where: { id: BigInt(req.params.id as string) } });
        res.json({ message: 'Subject deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to delete subject' });
    }
};
