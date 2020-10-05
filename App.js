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
import { FAB  , TextInput } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import pictureTab from './pictureTab';


const Tab = createMaterialBottomTabNavigator();

export const DpTab =() =>{
  const [link , setLink] = useState("");
  const [bio , setBio ] = useState("");
  const [dpURL , setDpURL] = useState("");
  const [fullName , setFullName ] = useState("");
  const [loading , setLoading ] = useState(false);
  const [visible, setVisible] = useState(false);
  const [downloadble ,setDownloadble ] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const downloadFile= () =>{

    toggleOverlay();

    const uri = dpURL;
    var filename = "";
    const index = link.lastIndexOf("com/");
    const SecondIndex = link.lastIndexOf("?");
      filename = link.slice(index+4 , SecondIndex);

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
      setBio(json.graphql.user.biography);
      setFullName(json.graphql.user.full_name);
      setDpURL(json.graphql.user.profile_pic_url_hd);
      setDownloadble(true);
      // console.log(json.graphql.user.biography);
      // console.log(json.graphql.user.full_name);
      // console.log(json.graphql.user.profile_pic_url_hd);
    } )
    .catch((error) => 
    {
      alert("Error : Invalid URL ");

      setBio("");
      setDpURL("");
      setFullName("");
      setDownloadble(false);    
    });
  }
  else
  {
    alert("Error : No URL entered ");
    setBio("");
    setDpURL("");
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
          backgroundColor : "skyblue" ,
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
          <View>
            <Text style={{fontSize: 18}} >{bio}</Text>
          </View>
        </View>

        <View style={styles.ImageContainer} > 
          
        <Image
        source={ dpURL? { uri: dpURL }: { uri:"https://www.bestofelectricals.com/images/default-image.png" }}
        style={{ width: 350, height: 350 }}
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

const App = () =>
{

  return(
      <NavigationContainer>
        <Tab.Navigator shifting={true} keyboardHidesNavigationBar={true}  >
          <Tab.Screen name="DpTab" component={DpTab}
          options={{
            tabBarLabel : "Dp" ,
            tabBarIcon : ({color})=>(<AntDesign name="user" size={24} color={color} />),
          }}
          />
          <Tab.Screen name="pictureTab" component={pictureTab} 
          options={{
            tabBarLabel : "Pictures",
            tabBarColor : "#E64A19",
            tabBarIcon : ({color})=>(<AntDesign name="picture" size={24} color={color}/> ),
          }}
          />
        </Tab.Navigator>
      </NavigationContainer>
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
    backgroundColor : "skyblue"
  },
});


export default App;