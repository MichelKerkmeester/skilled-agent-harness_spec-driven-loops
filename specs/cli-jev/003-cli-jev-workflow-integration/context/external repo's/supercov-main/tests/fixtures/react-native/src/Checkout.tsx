import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
export const platformName = Platform.select({
  ios: 'Apple',
  android: 'Android',
  default: 'Other',
});
export function Checkout({ save }: { save: (name: string) => Promise<void> }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Ready');
  async function submit() {
    setStatus('Saving');
    try {
      await save(name);
      setStatus('Saved');
    } catch {
      setStatus('Failed');
    }
  }
  return (
    <View>
      <Text>{platformName}</Text>
      <TextInput
        accessibilityLabel="Name"
        value={name}
        onChangeText={setName}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save"
        accessibilityState={{ disabled: !name }}
        disabled={!name}
        onPress={submit}
      >
        <Text>Save</Text>
      </Pressable>
      <Text accessibilityRole="alert">{status}</Text>
    </View>
  );
}
export function Delayed({ load }: { load: () => Promise<string> }) {
  const [value, setValue] = useState('Loading');
  useEffect(() => {
    let active = true;
    load().then((v) => {
      if (active) setValue(v);
    });
    return () => {
      active = false;
    };
  }, [load]);
  return <Text>{value}</Text>;
}
