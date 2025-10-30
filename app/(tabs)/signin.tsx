import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { TaskContext } from "../../contexts/TaskContext";

/**
 * SignInScreen component allows users to sign in to their account
 * by providing an email and password. It handles input validation,
 * displays errors, and manages loading state.
 */
export default function SignInScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { signIn } = useContext(TaskContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * handleSignIn function validates the input fields
   * and calls the signIn function. It handles errors
   * and redirects to the home screen on success.
   */
  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/home");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.onBackground }]}>
        Sign In
      </Text>
      <Text style={[styles.subheading, { color: colors.onBackground }]}>
        Welcome back to my orbii....
      </Text>

      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword((v) => !v)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleSignIn}
        loading={loading}
        style={styles.button}
      >
        Sign In
      </Button>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={[styles.link, { color: colors.primary }]}>
          Don’t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 8,
  },
  error: {
    marginBottom: 16,
    textAlign: "center",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
  },
});
