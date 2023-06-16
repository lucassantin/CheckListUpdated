/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Check } from 'phosphor-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps { //essa interface define as props de um componente
  data: Date;
  onCompletedChanged: (completed: number) => void;
}

interface habitsInfo {
  possibleHabits: Array<{
    id: string,
    title: string,
    created_at: string,
  }> ,
  completedHabits: string[],
}

export function HabitsList({ data, onCompletedChanged }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<habitsInfo>() //salvando os dados que estao vindo do back

  useEffect(() => {
    api.get('/day', {
      params: {
        data: data.toISOString(),
      }
    }).then(response => {
      setHabitsInfo(response.data) // dado buscado da api
    })
  }, [data])

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/day/${data.toISOString()}/toggle/${habitId}`)
    
    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)

    let completedHabits: string[] = []  

    if (isHabitAlreadyCompleted) { //remover da lista de habitos completados
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
      
    } else { // adicionar na lista de habitos completados
      completedHabits = [...habitsInfo!.completedHabits, habitId]

    }
  
    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    })

    onCompletedChanged(completedHabits.length)
  }
      
  // const isDateInPast = dayjs(data).endOf('day').isBefore(new Date())

  return (
    <div className='mt-6 flex flex-col gap-3'>
      {habitsInfo?.possibleHabits.map(habit => {
          return ( // percorre todos os habitos e retorna um checkbox para o usuario preencher
            <Checkbox.Root 
              key={habit.id} 
              onCheckedChange={() => handleToggleHabit(habit.id)}
              className='flex items-center gap-3 group focus:outline-none '
              // disabled={isDateInPast}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center 
              bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500
              group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 
              group-focus:ring-offset-bg-background
              '>
                <Checkbox.Indicator>
                  <Check size={20} className='text-white'/>
                </Checkbox.Indicator>
              </div>
              <span 
                className='font-semibold text-xl text-white leading-tight 
                group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                {habit.title}
              </span>
            </Checkbox.Root>
          )
        })}
    </div>
  )
}