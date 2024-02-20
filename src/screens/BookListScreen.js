import { Pressable, View, ScrollView, Text } from "react-native";
import React, { useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BookItem from "../components/BookItem";
import BookContext from "../features/bookContext";
import { getBooks } from "../features/firebase/book";

const BookListScreen = ({ navigation }) => {
  const { Books, setBooks } = useContext(BookContext);

  const fetchAllBooks = async () => {
    const result = await getBooks();
    setBooks(result);
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Books",
      headerLeft: () => (
        <Pressable
          onPress={goBack}
          className=" justify-center items-center h-10 w-10 mx-4 rounded-full "
        >
          <MaterialIcons name="chevron-left" size={34} color={"#111"} />
        </Pressable>
      ),
      headerStyle: {
        backgroundColor: "white",
      },
      headerTitleAlign: "center",
    }),
      fetchAllBooks();
  }, []);
  return (
    <SafeAreaView className="flex-1 w-full px-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {Books?.map((Book) => (
          <Pressable key={Book.id} onPress={() => navigation.navigate("detailscreen", {
            BookId: Book?.id
          })}>
            <BookItem
              title={Book?.title}
              image={Book?.image}
              price={Book?.price}
              author={Book?.author}
              isbn={Book?.isbn}
              condition={Book?.condition}
              course={Book?.course}
              sellerid={Book?.sellerid}
            />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookListScreen;
