import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Detta är en prototyp. Inloggning är inte nödvändig.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Feed')}>
        <Text style={styles.buttonText}>Gå vidare</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0D0D0D' },
  message: { color:'#FADB17', fontSize:16, textAlign:'center', paddingHorizontal:20 },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FADB17',
    borderRadius: 5,
  },
  buttonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;