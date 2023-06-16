import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"
import dayjs from "dayjs"

const weekDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S',
]

const SummaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 22 * 7 
const amountOfDaysToFill = minimumSummaryDatesSize - SummaryDates.length 

type Summary = Array<{
  id: string;
  data: string;
  amount: number;
  completed: number;
}>

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)

      console.log(response.data)
    })
  }, [])


  return (
    <div className="w-full flex ">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => {
          return(
            <div 
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 flex items-center 
              font-bold justify-center">
              {weekDay}
            </div>
          )
        })}
      </div>
        {/* taa errado aq em baixo os dados nao estao sendo carregados do backend para aparecrer o progresso na tela */}
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && SummaryDates.map(date => {
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.data, 'day')
          })

          return (
            (<HabitDay 
              key={date.toString()}
              data={date}
              amount={dayInSummary?.amount} 
              defaultCompleted={dayInSummary?.completed??0}
            />
            )
          )
        })}

        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
          return (
            <div 
              key={i}
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg 
              opacity-40 cursor-not-allowed">
            </div>
          )
        })}
      </div>
    </div>
  )
}