import { ScrollView, View, Text } from "react-native"
import { useRoute } from "@react-navigation/native"
import { BackButton } from "../componentes/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../componentes/ProgressBar";
import { Checkbox } from "../componentes/Checkbox";
interface Params {
  date: string;
}

export function Habit() {
  const route = useRoute();
  const { date } = route.params as Params;

  const parsonDate = dayjs(date);
  const dayOfWeek = parsonDate.format('dddd');
  const dayAndMonth = parsonDate.format('DD/MM');

  return(
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={90}/>

        <View className="mt-6">
          <Checkbox 
            title={"Beber 2l de água"} 
            checked={false}
            />

            <Checkbox 
            title={"Caminhar"} 
            checked={false}
            />

            <Checkbox 
            title={"Comer"} 
            checked={true}
            />
        </View>

      </ScrollView>
    </View>
  )
}