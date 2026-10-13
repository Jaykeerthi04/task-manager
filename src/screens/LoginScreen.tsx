import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { ScreenProps } from '../navigation/types';

export default function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  return <AuthForm mode="login" onSwitchMode={() => navigation.replace('SignUp')} />;
}
