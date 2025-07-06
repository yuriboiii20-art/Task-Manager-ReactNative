import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, Keyboard, TouchableWithoutFeedback } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Button, useTheme } from "react-native-paper";
import Animated, {
  Layout,
  SlideInDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { withAuth } from "../../components/withAuth";

// Import custom components and contexts
import TaskItem from "../../components/TaskItem";
import TaskAddModal from "../../components/TaskAddModal";
import { TaskContext } from "../../contexts/TaskContext";
import { styles } from "../../styles/HomeScreenStyles";
import usePrevious from "../../hooks/usePrevious";

/**
 * Helper function to determine the greeting based on the device's current time.
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return "morning ☀️";
  if (hour >= 12 && hour < 18) return "afternoon 🌤️";
  return "evening 🌙";
}

/**
 * HomeScreen component serves as the main screen for the task manager application,
 * it displays the list of tasks, allows adding new tasks, and provides drag-and-drop functionality
 * for reordering tasks.
 *
 * Delegates task management to the TaskContext, which provides functions for adding,
 * editing, toggling, deleting, and reordering tasks, following the Delegate design pattern.
 */
function HomeScreen() {
  // Get task data and functions from TaskContext
  const { tasks, addTask, editTask, toggleTask, deleteTask, reorderTasks } =
    useContext(TaskContext);
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Get previous background color to interpolate from
  const prevBackground = usePrevious(colors.background) || colors.background;
  const progress = useSharedValue(1);

  // Animate progress when colors.background changes with duration 200ms for a smoother UX
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 200 });
  }, [colors.background]);

  /**
   * Animated style that interpolates between the previous and current background color.
   */
  const animatedStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      progress.value,
      [0, 1],
      [prevBackground, colors.background],
    );
    return { backgroundColor: bg };
  });

  /**
   * Add a new task to the list of tasks.
   *
   * @param text - The task text
   * @param color - The task color
   * @param dueDateStr - The task due date as a string
   */
  const handleAddTask = (text: string, color: string, dueDateStr: string) => {
    const dueDate = new Date(dueDateStr);
    addTask(text, color, dueDate);
  };

  /**
   * Edit an existing task.
   *
   * @param id - The task id
   * @param newText - The new task text
   * @param newColor - The new task color
   * @param newDueDate - The new due date as a Date object
   */
  const handleEditTask = (
    id: number,
    newText: string,
    newColor: string,
    newDueDate: Date,
  ) => {
    editTask(id, newText, newColor, newDueDate);
  };

  /**
   * Render each task item with drag-and-drop functionality.
   *
   * @param item - The task item
   * @param drag - The drag function
   */
  const renderItem = ({ item, drag }: { item: any; drag: () => void }) => (
    <ScaleDecorator>
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutUp}
        layout={Layout.springify()}
        style={{ overflow: "visible" }}
      >
        <TaskItem
          task={item}
          onToggleComplete={toggleTask}
          onDelete={deleteTask}
          drag={drag}
          onEdit={handleEditTask}
        />
      </Animated.View>
    </ScaleDecorator>
  );

  /**
   * Reorder tasks based on the new order after drag-and-drop.
   *
   * @param data - The new order of tasks
   */
  const onDragEnd = ({ data }: { data: any[] }) => {
    reorderTasks(data);
  };

  // Render the HomeScreen component
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.headerArea}>
          <Text style={[styles.heading, { color: colors.onBackground }]}>
            TASK MANAGER
          </Text>
          <Text style={[styles.subheading, { color: colors.onBackground }]}>
            Good {getGreeting()}!
          </Text>
        </View>

        <Button
          icon="plus"
          mode="contained"
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          labelStyle={{ fontSize: 16 }}
        >
          Add Task
        </Button>

        {/* If there are no tasks yet, invite the user to add one */}
        {tasks.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <Text
              style={{
                color: colors.onBackground,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              You have no tasks yet!{"\n"}Tap "Add Task" above to create your
              first task.
            </Text>
          </View>
        ) : (
          <DraggableFlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, drag, isActive }) => (
              <ScaleDecorator>
                <Animated.View
                  style={{
                    overflow: "visible",
                    zIndex: isActive ? 9999 : 0,
                  }}
                  entering={SlideInDown}
                  exiting={SlideOutUp}
                  layout={Layout.springify()}
                >
                  <TaskItem
                    task={item}
                    onToggleComplete={toggleTask}
                    onDelete={deleteTask}
                    drag={drag}
                    onEdit={handleEditTask}
                  />
                </Animated.View>
              </ScaleDecorator>
            )}
            onDragEnd={onDragEnd}
            dragItemOverflow={true}
            removeClippedSubviews={false}
            style={{ overflow: "visible" }}
            contentContainerStyle={{
              flexGrow: 1,
              overflow: "visible",
              marginTop: 16,
            }}
          />
        )}

        <TaskAddModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddTask}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default withAuth(HomeScreen);
