import { Text, View, Image } from "react-native";
import React from "react";

const BookItem = ({ isbn, title, author, condition, image, price, course, sellerid }) => {
  return (

    <View className="bg-white p-2 justify-center items-center rounded-lg w-full mb-4 border border-slate-200" >
      <View className="flex-row justify-center items-center">
        <View className=" items-center justify-center">
          <Image source={{ uri: image }} className="rounded-xl h-20 w-20 object-contain" />
        </View>
        <View className="flex-1 w-[100%] p-2">
          <View>
            <Text className="font-bold">{title}</Text>
            <Text className="text-xs">{author}</Text>
            <Text className="text-xs">{isbn}</Text>
          </View>
          <View className="mt-2">
            <Text className="text-xs">Price: ${price}</Text>
            <Text className="text-xs">Condition: {condition}</Text>
            <Text className="text-xs">Course: {course}</Text>
            <Text className="text-xs">Seller ID: {sellerid}</Text>
          </View>
        </View>
      </View>
    </View>

  );
};

export default BookItem;

