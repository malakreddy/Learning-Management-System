
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst();
  const video = await prisma.video.findFirst();

  if (user && video) {
    console.log(`Setting video ${video.id} as completed for user ${user.id}...`);
    await prisma.videoProgress.upsert({
      where: {
        user_id_video_id: {
          user_id: user.id,
          video_id: video.id
        }
      },
      update: { is_completed: true, completed_at: new Date() },
      create: { 
        user_id: user.id, 
        video_id: video.id, 
        is_completed: true, 
        completed_at: new Date() 
      }
    });
    console.log("Done.");
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
