import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { database, doc, deleteDoc } from "../config/firebaseconfig";
import { onSnapshot, collection } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';

export default function Task({ navigation }) {
  
  //Declara um estado para armazenar as tarefas
  const [task, setTask] = useState([]);
  
  //UseEffect para buscar tarefas do Firebase Firestore quando o componente é montado
  useEffect(() => {
    const taskCollection = collection(database, 'Tasks');
    const listen = onSnapshot(taskCollection, (query) => {
      const list = [];
      query.forEach((doc) => {
        //Adiciona cada documento da coleção à lista de tarefas com o id do documento
        list.push({ ...doc.data(), id: doc.id });
      });
      //Atualiza o estado das tarefas com a lista obtida
      setTask(list);
    });
    //Retorna uma função de limpeza para remover o listener quando o componente for desmontado
    return () => listen();
  }, []);

  //Função para deletar uma tarefa do Firestore
  function deleteTask(id) {
    const taskDocRef = doc(database, "Tasks", id);
    deleteDoc(taskDocRef);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.txtTask}>Tarefas</Text>
      <FlatList
        data={task}
        renderItem={({ item }) => {
          return (
            <View style={styles.task}>
              <TouchableOpacity
                onPress={() => {
                  deleteTask(item.id);
                }}
              >
                <AntDesign name="delete" size={24} color="black" />
              </TouchableOpacity>
              <Text>
                {item.description}
              </Text>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={styles.btnNewTask}
        onPress={() => navigation.navigate('NewTask')}
      >
        <Text style={styles.txtbtnNewTask}> + </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff1ed'
  },
  txtTask: {
    fontSize: 20,
    color: '#373D20',
    textAlign: 'center',
    top: 10,
  },
  btnNewTask: {
    backgroundColor: '#373D20',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
    borderRadius: 50,
    bottom: 50,
    marginLeft: 20,
    position: 'absolute',
  },
  txtbtnNewTask: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#BCBD8B',
  }
});
