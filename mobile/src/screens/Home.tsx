import { View, Text, ScrollView, Alert } from "react-native";
import { Header } from "../componentes/Header";
import { Loading } from "../componentes/Loading";
import { HabitDay, DAY_SIZE } from "../componentes/HabitDay";
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates'
import { useNavigation } from "@react-navigation/native";
import { api } from "../lib/axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
type SummaryProps = Array< {
  id: string;
  data: string;
  amount: number;
  completed: number;
}>;

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearsStart = generateRangeDatesFromYearStart();
const minimumSumaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSumaryDatesSizes - datesFromYearsStart.length;

export function Home(){
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);

  const { navigate } = useNavigation();

  async function fetchData() {
    try {
        setLoading(true);
        const response = await api.get('/summary');
        console.log(response.data);
        setSummary(response.data);
    } catch (error) {
      Alert.alert('Ops','Não foi possível carregar o sumário de hábitos.');
      console.log(error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  if(loading) {
    return (
    <Loading />
    )
  }

  return(
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {
          weekDays.map((weekDay, i) => (
            <Text key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          ))
        }
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {
          summary &&
          <View className="flex-row flex-wrap">
          {
            datesFromYearsStart.map((data) => {
              const dayWithHabits = summary.find(day => {
                return dayjs(data).isSame(day.data, 'day');
              })
              return(
                <HabitDay 
                  key={data.toISOString()} 
                  data={data}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  onPress={() => navigate('Habit', {date: data.toISOString() })}
                />
            )})
          }

          {
            amountOfDaysToFill > 0 && Array
            .from({ length: amountOfDaysToFill })
            .map((_, i) => (
              <View 
              key={i}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE}}
              />
            ))
          }
        </View>
        }
      </ScrollView>  
    </View>
  )
}