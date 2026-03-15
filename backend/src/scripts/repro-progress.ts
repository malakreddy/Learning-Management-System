
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.findMany({ take: 5 });
  console.log("Users:", users.map(u => ({ id: u.id.toString(), email: u.email })));

  if (users.length > 0) {
    const userId = users[0].id;
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

    console.log(`Enrollments for ${users[0].email}:`, enrollments.length);

    for (const e of enrollments) {
      const videoIds = e.subject.sections.flatMap(section => 
        section.videos.map(video => video.id)
      );
      const totalVideos = videoIds.length;
      const completedCount = await prisma.videoProgress.count({
        where: {
          user_id: userId,
          video_id: { in: videoIds },
          is_completed: true
        }
      });
      const progress = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;
      console.log(`- Subject: ${e.subject.title}, Progress: ${progress}%, Completed: ${completedCount}/${totalVideos}`);
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
