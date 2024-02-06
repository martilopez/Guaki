import React, { Component, useState } from 'react';
import { Text, View, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';

import Carousel from 'react-native-snap-carousel-new'; // Version can be specified in package.json

import { Recepies } from '../../schema/recepies';
import Colors from '../../assets/colors';
import text from '../styles/text';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParams } from '../../App';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

interface RecepieListProps {
  data: Recepies[]
}

//Recepie carousel component
const RecipeCarousel: React.FC<RecepieListProps> = ({ data }) => {
  const [index, setindex] = useState<number>()
  //Navigation props
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  //Render each item from the corousel
  const renderItem = ({ item }: { item: Recepies }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("RecepieDetail", { recepie: item })} style={styles.itemContainer}>
        <Image source={require("../../assets/salad.jpg")} style={styles.img} />
        <View style={styles.info}>
          <Text style={[text.BlackBold]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        containerCustomStyle={styles.carouselContainer}
        inactiveSlideShift={0}
        onSnapToItem={(index) => setindex(index)}
        useScrollView={true}
      />
    </View>
  );

}

export default RecipeCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
  },

  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: "column",
  },

  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  img: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
    height: '70%'
  },
  info: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
    paddingHorizontal: 10,
  }
});
