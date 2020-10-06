import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity ,PermissionsAndroid } from 'react-native';
import { StyleSheet, Text,  View , Dimensions, KeyboardAvoidingView, ScrollView, StatusBar  } from 'react-native';
import { Image, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { Overlay } from 'react-native-elements';
import { FAB , TextInput } from 'react-native-paper';


export default function pictureTab() {
  const [link , setLink] = useState("");
  const [pictureURL , setpictureURL] = useState("");
  const [fullName , setFullName ] = useState("");
  const [loading , setLoading ] = useState(false);
  const [visible, setVisible] = useState(false);
  const [downloadble ,setDownloadble ] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const downloadFile= () =>{

    toggleOverlay();

    const uri = pictureURL;
    var filename = fullName ;

    let fileUri = FileSystem.documentDirectory + filename +".jpg";
    FileSystem.downloadAsync(uri, fileUri)
    .then(({ uri }) => {
        saveFile(uri);
      })
      .catch(error => {
        console.error(error);
      })
}

const saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync("Download", asset, false);
        alert("SUCESS : file downloaded successfully");
        setVisible(false);
    }
}


  const getData = async(value) =>
{
  setLoading(true);
  //remove below line if any problem occurs
  setDownloadble(false);

  value = value.trim();
  if(value)
  {
    var newValue = "";
    const index = value.lastIndexOf("?");
    if(index != -1)
    {
      newValue = value.slice(0,index);
      console.log(newValue);
    }
    else
    {
      newValue = value;
    }
    const url = newValue.concat("?__a=1");
    console.log(url);
    await fetch(url)
    .then(response => response.json())
    .then( json => {

      setFullName(json.graphql.shortcode_media.owner.full_name);
      setpictureURL(json.graphql.shortcode_media.display_url);
      setDownloadble(true);
      console.log(json.graphql.shortcode_media.display_url);
      console.log(json.graphql.shortcode_media.owner.full_name);
    } )
    .catch((error) => 
    {
      alert("Error : Invalid URL or The account is private ");

      setpictureURL("");
      setFullName("");
      setDownloadble(false);    
    });
  }
  else
  {
    alert("Error : No URL entered ");

    setpictureURL("");
    setFullName("");

    setDownloadble(false);

  }
  setLoading(false);

}

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.view} >
        <ScrollView>
          <Text style={styles.text} >Insta Downloader</Text>
          
        <View style={styles.InputContainer}>
        <TextInput style={styles.textInput } label="Paste your link here"
         value={link} mode="outlined"
         theme={{ colors: { primary: 'grey',underlineColor:'transparent',}}}
         onChangeText={text => setLink(text)}  />
        <TouchableOpacity style={{
          backgroundColor : "#29B6F6" ,
          padding : height*0.022 ,
          borderRadius : height /10,
          }} onPress={() =>{ getData(link);} }   
        >
          {
            loading ?
            <ActivityIndicator
              color="black"
          />            
            :
        <AntDesign name="arrowright" size={24} color="black" />
          }
        
        </TouchableOpacity>
        </View>

        <View style={styles.downContainer}>

        <Overlay isVisible={visible} >
        <ActivityIndicator
              color="black"
              size="large"
          /> 
          <Text style={{fontSize:20 , fontWeight : "bold"}} >Downloading..</Text>
      </Overlay>

      
        <View style={{ padding: 15 }} >

          
            <Text style={{fontSize: 25 , fontWeight : "bold" }}>{fullName}</Text>
          </View>
        </View>

        <View style={styles.ImageContainer} > 
          
        <Image
        source={ pictureURL? { uri: pictureURL }: { uri: null } }
        style={{ width: width*0.9 , height: height*0.7  }}
        resizeMode = "contain"
        PlaceholderContent={<ActivityIndicator />}
          />
                 <FAB
            style={styles.fab}
            large
            icon="download"
            visible = {downloadble}
            onPress={()=>downloadFile()}
          />
          <Text style={styles.text} >Insta Downloader</Text>

        </View>


        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width ;
const statusbarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInput : 
  {
    width : width * 0.7 ,
  },
  view : 
  {
    flex : 1 ,
    marginTop : statusbarHeight * 2 ,
  },
  ImageContainer : 
  {
    top : height * 0.08,
    justifyContent : "center",
    alignItems : "center",
  },
  InputContainer:
  {
    flex : 1,
    alignItems : "center",
    flexDirection : "row",
    justifyContent : "space-between",
    marginHorizontal : width * 0.05,
  },
  text :
  {
    fontSize : 40 ,
    // fontWeight : "bold",
    color : "red",
    alignSelf : "center",
    marginBottom : statusbarHeight * 0.5,
    fontFamily:"lobster" ,

  },
  downContainer : 
  {
    top : height * 0.05,
    justifyContent : "center",
    alignItems : "center",
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 5,
    bottom: statusbarHeight * 3,
    backgroundColor : "#29B6F6",
  },
});
