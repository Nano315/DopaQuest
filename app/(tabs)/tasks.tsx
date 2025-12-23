import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { DEFAULT_GLOBAL_DIFFICULTY, DIFFICULTY_REWARDS, GLOBAL_MULTIPLIERS } from '@/constants/GameRules';
import { useStore } from '@/store';
import { Task, TaskDifficulty } from '@/types/task';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sunday to Saturday

export default function TasksScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { tasks, addTask, toggleTask, removeTask } = useStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<TaskDifficulty>('medium');
  const [newTaskSchedule, setNewTaskSchedule] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // Default all days

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, newTaskDifficulty, newTaskSchedule);
      setNewTaskTitle('');
      setNewTaskSchedule([0, 1, 2, 3, 4, 5, 6]);
      setModalVisible(false);
    }
  };

  const toggleDay = (index: number) => {
    if (newTaskSchedule.includes(index)) {
      setNewTaskSchedule(newTaskSchedule.filter(d => d !== index));
    } else {
      setNewTaskSchedule([...newTaskSchedule, index].sort());
    }
  };

  const getRewardValue = (difficulty: TaskDifficulty) => {
     return Math.round(DIFFICULTY_REWARDS[difficulty] * GLOBAL_MULTIPLIERS[DEFAULT_GLOBAL_DIFFICULTY]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskItem, { backgroundColor: colors.cardBackground, borderColor: colors.borderColor }]}>
      <Pressable onPress={() => toggleTask(item.id)} style={styles.checkButton}>
        <FontAwesome
          name={item.completed ? 'check-circle' : 'circle-thin'}
          size={32}
          color={item.completed ? colors.success : colors.text}
        />
      </Pressable>
      <View style={styles.taskContent}>
        <Text style={[
            styles.taskTitle, 
            { color: colors.text, textDecorationLine: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.5 : 1 }
        ]}>
          {item.title}
        </Text>
        <Text style={[styles.taskMeta, { color: colors.text, opacity: 0.7 }]}>
          {item.difficulty.toUpperCase()} • +{getRewardValue(item.difficulty)} min
        </Text>
      </View>
      <Pressable onPress={() => removeTask(item.id)} style={styles.deleteButton}>
        <FontAwesome name="trash-o" size={20} color={colors.text} style={{ opacity: 0.5 }} />
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>No tasks yet. Add one to earn time!</Text>
        }
      />

      {/* FAB */}
      <Pressable 
        style={[styles.fab, { backgroundColor: colors.serenity }]}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </Pressable>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
        >
          <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
            
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Quest</Text>
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
              placeholder="Task title (e.g. Read 10 pages)"
              placeholderTextColor="#999"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <Text style={[styles.sectionLabel, { color: colors.text }]}>Difficulty</Text>
            <View style={styles.difficultyContainer}>
              {(['easy', 'medium', 'hard'] as TaskDifficulty[]).map((diff) => (
                <Pressable
                  key={diff}
                  style={[
                    styles.diffButton,
                    newTaskDifficulty === diff && { backgroundColor: colors.serenity },
                    { borderColor: colors.borderColor }
                  ]}
                  onPress={() => setNewTaskDifficulty(diff)}
                >
                  <Text style={[
                      styles.diffText, 
                      newTaskDifficulty === diff ? { color: '#fff' } : { color: colors.text }
                  ]}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { color: colors.text }]}>Recurrence</Text>
            <View style={styles.daysContainer}>
                {DAYS.map((day, index) => {
                    const isSelected = newTaskSchedule.includes(index);
                    return (
                        <Pressable 
                            key={index} 
                            style={[
                                styles.dayCircle, 
                                { borderColor: colors.borderColor },
                                isSelected && { backgroundColor: colors.serenity, borderColor: colors.serenity }
                            ]}
                            onPress={() => toggleDay(index)}
                        >
                            <Text style={[
                                styles.dayText,
                                { color: isSelected ? '#fff' : colors.text }
                            ]}>{day}</Text>
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: colors.serenity }]} onPress={handleAddTask}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create</Text>
              </Pressable>
            </View>
            
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    opacity: 0.6,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  checkButton: {
    marginRight: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskMeta: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalView: {
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%', // Limit height
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  diffButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  diffText: {
    fontSize: 14,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  dayCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  dayText: {
      fontSize: 12,
      fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
