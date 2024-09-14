import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Button, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
	const [modalVisible, setModalVisible] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [memories, setMemories] = useState([]);

	useEffect(() => {
		// Retrieve memories from AsyncStorage when component mounts
		retrieveMemories();
	}, []);

	const retrieveMemories = async () => {
		try {
			const storedMemories = await AsyncStorage.getItem('memories');
			if (storedMemories !== null) {
				// If memories exist, parse and set them in state
				setMemories(JSON.parse(storedMemories));
			}
		} catch (error) {
			console.error('Error retrieving memories:', error);
		}
	};

	const saveMemory = async (title, description) => {
		try {
			// Check if title or description is empty
			if (!title.trim()) {
				setModalVisible(false);
				setTitle('')
				setDescription('')
				return; // Exit the function if title or description is empty
			}

			// Create a new memory object
			const newMemory = { id: Date.now().toString(), title, description };
			// Update the list of memories with the new memory
			const updatedMemories = [...memories, newMemory];
			// Save the updated list of memories to AsyncStorage
			await AsyncStorage.setItem('memories', JSON.stringify(updatedMemories));
			// Update the memories state
			setMemories(updatedMemories);
			// Close the modal
			setModalVisible(false);
			setTitle('')
			setDescription('')
		} catch (error) {
			console.error('Error saving memory:', error);
		}
	};

	const handlePress = () => {
		setModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Memories</Text>
			{memories.length === 0 ? (
				<Text style={styles.body}>No memories yet!</Text>
			) : (
				<FlatList
					data={memories}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ width: '100%' }} // Set the width of the list
					renderItem={({ item }) => (
						<View style={styles.memoryItem}>
							<Image source={require('../assets/images/feather.png')} style={styles.featherIcon} />
							<View style={styles.memoryContent}>
								<Text style={styles.memoryTitle}>{item.title}</Text>
								<Text>{item.description}</Text>
							</View>
						</View>
					)}
				/>
			)}
			<TouchableOpacity style={styles.button} onPress={handlePress}>
				<Text style={styles.buttonText}>Add a memory</Text>
			</TouchableOpacity>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(false);
				}}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Add Memory</Text>
						<TextInput
							style={styles.input}
							placeholder="Title"
							onChangeText={(text) => setTitle(text)}
						/>
						<TextInput
							style={styles.input}
							placeholder="Description"
							onChangeText={(text) => setDescription(text)}
						/>
						<Button title="Save" onPress={() => saveMemory(title, description)} />
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#F07300',
		borderRadius: 8,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 20
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},
	title: {
		fontSize: 30,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	body: {
		fontSize: 18,
		textAlign: 'center'
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 8,
		width: '80%'
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 10,
		marginBottom: 10
	},
	memoryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#ccc',
		paddingVertical: 10,
	},
	memoryContent: {
		marginLeft: 10,
	},
	memoryTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	featherIcon: {
		width: 24,
		height: 24,
	},
});
