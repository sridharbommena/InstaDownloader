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
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

export default function videoTab() {
  const [link , setLink] = useState("");
  const [videoURL , setvideoURL] = useState("");
  const [fullName , setFullName ] = useState("");
  const [loading , setLoading ] = useState(false);
  const [visible, setVisible] = useState(false);
  const [downloadble ,setDownloadble ] = useState(false);
  const [isPlaying , setIsPlaying ] = useState(false);
  const [isMute , setIsMute ] = useState(false);

  const playOrPause = () =>{

    setIsPlaying(!isPlaying);

  }

  const muteOrUnmute = () =>
  {
      setIsMute(!isMute);
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const downloadFile= () =>{

    toggleOverlay();
    muteOrUnmute();
    playOrPause();

    const uri = videoURL;
    var filename = fullName ;

    let fileUri = FileSystem.documentDirectory + filename +".mp4";
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
  setIsMute(false);
  setIsPlaying(false);

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
      setvideoURL(json.graphql.shortcode_media.video_url);
      setDownloadble(true);
      console.log(json.graphql.shortcode_media.video_url);
      console.log(json.graphql.shortcode_media.owner.full_name);
    } )
    .catch((error) => 
    {
      alert("Error : Invalid URL or The account is private ");

      setvideoURL("");
      setFullName("");
      setDownloadble(false);    
    });
  }
  else
  {
    alert("Error : No URL entered ");

    setvideoURL("");
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
        <TextInput style={styles.textInput } label="Paste the link here"
         value={link} mode="outlined"
         theme={{ colors: { primary: 'grey',underlineColor:'transparent',}}}
         onChangeText={text => setLink(text)}  />
        <TouchableOpacity style={{
          backgroundColor : "#29B6F6" ,
          padding : height*0.025 ,
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
          <View style={{flex : 1 , flexDirection : "row" , justifyContent : "space-around" }} >
          
        {
            downloadble ?
            (   
                <TouchableOpacity onPress={()=> playOrPause() } style={styles.accessBtn} >
                {   isPlaying ?
                    (
                        <View style={{flex : 1 , flexDirection : "row" }}>
                        <Ionicons name="md-pause" size={20} color="black" />
                        <Text style={{paddingLeft : 10}} >Pause</Text>
                        </View>
                    )
                    :
                    
                    (
                        <View style={{flex : 1 , flexDirection : "row" }}>
                        <Ionicons name="md-play" size={20} color="black" />
                        <Text style={{paddingLeft : 10}} >Play</Text>
                        </View>
                    )
                }       
                </TouchableOpacity>
            ):
            null
        }

       {
            downloadble ?
            (   
                  
                <TouchableOpacity onPress={()=> muteOrUnmute() } style={styles.accessBtn} >
                {   isMute ?
                    (
                        <View style={{flex : 1 , flexDirection : "row" }}>
                        <Octicons name="unmute" size={20} color="black" />
                        <Text style={{paddingLeft : 10}} >UnMute</Text>
                        </View>
                    )
                    :
                    
                    (
                        <View style={{flex : 1 , flexDirection : "row" }}>
                        <Octicons name="mute" size={20} color="black" />
                        <Text style={{paddingLeft : 10}} >Mute</Text>
                        </View>
                    )
                }       
                </TouchableOpacity>
            ):
            null
        }
        
          </View>
        </View>



        <View style={styles.ImageContainer} > 

        <Video
            source={{ uri: videoURL }}
            rate={1.0}
            volume={1.0}
            isMuted={isMute}
            resizeMode="contain"
            shouldPlay={isPlaying}
            style={{ width: 300, height: 300 }}
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
    fontWeight : "bold",
    color : "red",
    alignSelf : "center",
    marginBottom : statusbarHeight * 0.5,
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
    backgroundColor : "#29B6F6"
  },
  accessBtn : 
  {
    padding : 15 ,
    backgroundColor : "#29B6F6",
    marginHorizontal : 20 ,
    paddingHorizontal : width *0.09 ,
    borderRadius : 15
  },
});
