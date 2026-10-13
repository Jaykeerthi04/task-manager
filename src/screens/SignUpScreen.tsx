import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { ScreenProps } from '../navigation/types';

export default function SignUpScreen({ navigation }: ScreenProps<'SignUp'>) {
  return <AuthForm mode="signup" onSwitchMode={() => navigation.replace('Login')} />;
}
