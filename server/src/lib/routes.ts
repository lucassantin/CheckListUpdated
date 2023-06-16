import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "./prisma"
import dayjs from "dayjs"
 
export async function appRoutes(app: FastifyInstance) {
  //criando uma rota
  app.post("/habits", async (request) => { //post pq estou criando um recurso
    // temos de buscar title e os dias do habito (weekdays)
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    await prisma.habit.create({
      data: {
        title,
        created_at: new Date(),
        WeekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    })
  })

  app.get("/day", async (request, response) => {
    const getDayParams = z.object({
      data: z.coerce.date()
    })
    const safeDate = getDayParams.safeParse(request.query)
    if(!safeDate.success) {
      return response.status(400).send({error: safeDate.error.issues, message: "Verify the query params"})
    }
    //extract the data from the safeDate
    const data = safeDate.data.data
    const parsedDate = dayjs(data).startOf("day")
    const nextDay = parsedDate.add(1, "day")
    const weekDay = parsedDate.get("day")
    console.log(weekDay)
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: nextDay.toDate()
        },
        WeekDays: {
          some: {
            week_day: weekDay,
          }      
        }
      }
    })
    console.log(possibleHabits)
    const day = await prisma.day.findUnique({
      where: {
        data: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    })
    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    }) ?? []

    return {
      possibleHabits,
      completedHabits,
    }
  })


  // completar / nao completar um habito

  app.patch("/day/:data/toggle/:id", async (request, response) => {
    //route param => parametro de identificacao

    const toggleHabitParams = z.object ({
      id: z.string().uuid(),
      data: z.coerce.date(),
    })

    const safeParsed = toggleHabitParams.safeParse(request.params)
    if(!safeParsed.success) { 
      return response.status(400).send({error: safeParsed.error.issues, message: "Verify the query params"})
    } 
    const { id, data } = safeParsed.data

    const dateSelected = dayjs(data).startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        data: dateSelected,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          data: dateSelected,
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    })

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    }
    else {
        await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      })
    }
  })
  // essa rota nao esta funcionando erro de sintaxe
  app.get("/summary", async () => {
    const summary = await prisma.$queryRaw`
      SELECT
       D.id, 
       D.Data,
       (
         SELECT 
          cast(count(*) as float)
         FROM day_habits DH
         WHERE DH.day_id = D.id
       ) as completed,
       (
         SELECT 
          cast(count(*) as float)
         FROM habit_week_days HWD
         JOIN habits H
          ON H.id = HWD.habit_id
         WHERE 
          HWD.week_day = cast(strftime('%W', DATETIME(ROUND(D.data/ 1000), 'unixepoch')) as int)
          AND H.created_at <= D.data
       ) as amount 
      FROM days D
    `;

    return summary;
  });
}