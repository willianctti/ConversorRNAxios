import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard} from 'react-native';
import Picker from './src/components/Picker';
import React, {useState, useEffect} from 'react';
import api from './src/services/api';

export default function App() {
  
  
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true)

  const [selectedMoeda, setSelectedMoeda] = useState(null);
  const [moedaBValue, setMoedaBValue] = useState(0);

  const [moedaValue, setMoedaValue] = useState(null)
  const [convertedValue, setConvertedValue] = useState(0)

    useEffect(() => {
      async function loadMoedas() {
        const response = await api.get('all')
        let arrayMoedas = []
        Object.keys(response.data).map((key) => {
            arrayMoedas.push({
              key: key,
              label: key,
              value: key
            })
        }) 
        setMoedas(arrayMoedas)
        setLoading(false);
      }
      loadMoedas();
    }, [])

  async function converter() {
    if(selectedMoeda === null || moedaBValue === 0) {
      alert('Por favor, selecione uma moeda')
      return;
    }
    const response = await api.get(`all/${selectedMoeda}-BRL`)
    let resultado = (response.data[selectedMoeda].ask * parseFloat(moedaBValue));
    setConvertedValue(`R$ ${resultado.toFixed(2)}`)
    setMoedaValue(moedaBValue)

    Keyboard.dismiss();
  }

  if(loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator color="#fff" size={45} />
    </View>
    )
  
  } else {
    return (
      <View style={styles.container}>
          <View style={styles.areaMoeda}>
              <Text style={styles.title}> Selecione a moeda:</Text>
            <Picker moedas={moedas} onChange={ (moeda) => setSelectedMoeda(moeda) }/>
          </View>
  
          <View style={styles.valueArea}>
             <Text style={styles.title}> Digite um valor para converter em (R$) :</Text>
            <TextInput 
            onChange={ (valor) => setMoedaBValue(valor)}
            keyboardType='numeric'
              placeholder='Exemplo'
              style={styles.input}
              />
          </View>
  
        <TouchableOpacity style={styles.buttonArea} onPress={converter}>
            <Text style={styles.textButton}>Converter</Text>
        </TouchableOpacity>
  
        {convertedValue !== 0 && (
          <View style={styles.resultArea}>
            <Text style={styles.convertedValue}>{moedaValue} {selectedMoeda}</Text>
            <Text style={[styles.convertedValue, { fontSize: 20, margin: 10}]}> Corresponde a: </Text>
            <Text style={styles.convertedValue}>{convertedValue}</Text>
          </View>

        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#101215',
    marginTop: 50,
    paddingTop: 40
  },
  areaMoeda: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingTop: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1
  },
  title: {
    fontSize: 15,
    paddingTop: 5,
    paddingLeft: 5
  },
  valueArea: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingBottom: 9,
    paddingTop: 9
  },
  input: {
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 9,
    color: '#000'
  },
  buttonArea: {
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },
  resultArea: {
    width: '90%',
    backgroundColor: '#fff',
    marginTop: 35,
    alignItems: 'center',
    justifyContent: 'center',

    padding: 20
  },
  convertedValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000'
  }
 
});
