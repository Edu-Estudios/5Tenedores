import React from 'react';
import { Image } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';

export default function CarouselImages(props) {
    const { arrayImages, height, width } = props

    /* El {item} es como si se hiciera destructuring de props */
    const renderItem = ({item}) => {
        return <Image style={{width, height}} source={{uri: item}}/>
    }


    {/* El componente Carousel ejecuta automáticamente un bucle con los datos de "data"*/}
    return (
        <Carousel 
            layout={"default"}
            data={arrayImages}
            sliderWidth={width}
            itemWidth={width}
            renderItem={renderItem}
        />
    )
}


