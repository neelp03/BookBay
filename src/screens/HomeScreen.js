import { Text, View, Image, ScrollView, Pressable } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UserImage from "../../assets/user.png";
import NewArrivalsCard from "../components/NewArrivalsCard";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthenticationModal from "../components/AuthenticationModal";
import AuthContext from "../features/authContext";
import BookContext from "../features/bookContext";
import { getBooks } from "../features/firebase/book";

const Home = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const { books, setBooks } = useContext(BookContext);

  const fetchAllbooks = async () => {
    const result = await getBooks()
    setBooks(result)
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    fetchAllbooks()
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-row px-5 mt-6 justify-between items-center">
          <View className="bg-black rounded-full w-10 h-10 justify-center items-center">
            <MaterialIcons name="menu" size={24} color={"#fff"} />
          </View>
          {!isLoggedIn && (
            <Pressable onPress={() => setModalVisible(!modalVisible)} className="flex-row items-center justify-center border border-slate-400 rounded-full ">
              <Image
                source={UserImage}
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: "#aaaaaa",
                  borderRadius: 50,
                }}
              />
              <Text className="font-semibold py-2 pr-4 pl-2">Login</Text>
            </Pressable>
          )}
        </View>

        <View className="mt-6 px-5">
          <Text className="font-bold text-2xl">Welcome <Text className="font-bold text-slate-500">{currentUser?.name}</Text></Text>
          <Text className="font-semibold text-xl text-gray-500">
            to BookBay!
          </Text>
        </View>

        <View className="mt-6 px-5">
          <View className="flex-row bg-gray-200 p-2 px-3 items-center rounded-3xl">
            <View className="">
              <MaterialIcons name="search" size={24} color={"#111"} />
            </View>
            <TextInput
              placeholder="Search..."
              placeholderTextColor={"#666666"}
              className="px-2"
            />
          </View>
        </View>
        {/* <View className="mt-6 p-5">
          <OfferCard />
        </View> */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center px-5">
            <Text className="text-lg font-extrabold">New Arrivals</Text>
            <Pressable onPress={() => navigation.navigate("productlistscreen")}>
              <Text className="text-xs text-gray-500">View All</Text>
            </Pressable>
          </View>
          <ScrollView
            className="mt-4 ml-5"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {books?.map(book =>
              <Pressable key={book.id}
                onPress={() => navigation.navigate("detailscreen",
                  { bookId: book.id })}>
                <NewArrivalsCard title={book.title} image={book.image} price={book.price} author={book.author} />
              </Pressable>
            )}

          </ScrollView>
        </View>
        <AuthenticationModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
