import React, { useState } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles } from "../styles/TaskAddModalStyles";

/**
 * Props for the TaskAddModal component.
 */
interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (text: string, color: string, dueDate: string) => void;
}

// Predefined colors for the user to choose from (though they can also enter a custom hex code)
const PRESET_COLORS = [
  "#ffffff", // white
  "#ffe4b5", // moccasin
  "#ffd700", // gold
  "#ff69b4", // hot pink
  "#b0e0e6", // powder blue
  "#90ee90", // light green
  "#cccccc", // light gray
  "#ffcccb", // light red
  "#8a2be2", // blue violet
  "#00ced1", // dark turquoise
  "#ff4500", // orange red
  "#32cd32", // lime green
];

/**
 * TaskAddModal component is a modal that allows the user to add a new task.
 *
 * @param visible - Whether the modal is visible.
 * @param onClose - Function to close the modal.
 * @param onAdd - Function to add a new task.
 */
export default function TaskAddModal({ visible, onClose, onAdd }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [customColor, setCustomColor] = useState("");

  /**
   * Handles adding a new task to the list of tasks.
   */
  const handleAddTask = () => {
    if (!text.trim()) return;
    let finalColor = color;
    if (customColor.trim().length >= 3 && customColor.startsWith("#")) {
      finalColor = customColor;
    }
    const dueString = date.toISOString().split("T")[0];
    onAdd(text.trim(), finalColor, dueString);

    // Reset the form
    setText("");
    setCustomColor("");
    setColor("#ffffff");
    setDate(new Date());
    onClose();
  };

  /**
   * Opens the date picker modal.
   */
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  /**
   * Handles the date change event from the date picker.
   *
   * @param event - The event that triggered the change.
   * @param selectedDate - The selected date.
   */
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false); // Android doesn't close the date picker automatically
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.surface },
        ]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text
              variant="titleLarge"
              style={[styles.title, { color: colors.onBackground }]}
            >
              Add a New Task
            </Text>

            <TextInput
              label="Task Description"
              value={text}
              onChangeText={setText}
              style={[styles.input]}
              mode="outlined"
              placeholderTextColor={colors.onBackground}
              theme={{ colors: { onSurfaceVariant: colors.onBackground } }}
            />

            {/* DATE PICKER */}
            <Button
              mode="outlined"
              style={[styles.input, { alignSelf: "stretch" }]}
              onPress={openDatePicker}
              textColor={colors.onBackground}
            >
              Due Date: {date.toISOString().split("T")[0]}
            </Button>

            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  textColor={colors.onBackground}
                />
              </View>
            )}

            <Text style={[styles.label, { color: colors.onBackground }]}>
              Pick a Color
            </Text>
            <View style={styles.colorRow}>
              {PRESET_COLORS.map((c) => (
                <Button
                  key={c}
                  mode={color === c ? "contained" : "outlined"}
                  onPress={() => {
                    setColor(c);
                    setCustomColor("");
                  }}
                  style={[styles.colorButton, { backgroundColor: c }]}
                  labelStyle={{ color: "#000" }}
                >
                  {color === c ? "✓" : ""}
                </Button>
              ))}
            </View>
            <TextInput
              label="Or custom hex (#ffffff)"
              value={customColor}
              onChangeText={setCustomColor}
              style={styles.input}
              mode="outlined"
              placeholderTextColor={colors.onBackground}
              theme={{ colors: { onSurfaceVariant: colors.onBackground } }}
            />

            <View style={styles.row}>
              <Button onPress={onClose} style={styles.button}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleAddTask}
                style={styles.button}
              >
                Add
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
}
