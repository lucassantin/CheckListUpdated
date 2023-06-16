import dayjs from "dayjs"

export function generateDatesFromYearBeginning() {
  const firstDayOfTheYear = dayjs().startOf('year')
  const today = new Date()

  const dates = []
  let dateToComparision = firstDayOfTheYear
  
  while (dateToComparision.isBefore(today)) { // chama a funcao de comparar a data do inicio do ano porem para comparar o dia anterior
    dates.push(dateToComparision.toDate())
    dateToComparision = dateToComparision.add(1, 'day')
  }

  return dates
}