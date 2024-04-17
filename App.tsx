import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
  FormControl,
  Input,
  VStack,
  Center,
  Checkbox,
  Button,
  NativeBaseProvider,
  Switch,
  Box,
  Select,
  CheckIcon
} from 'native-base';
interface FormValues {
  username: string;
  password: string;
  serverAddress: string;
  serverPath?: string;
  port?: string;
  useSSL?: boolean;
  accountType: string;
}

const advancedSchema = Yup.object().shape({
  username: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Required')
    .matches(/.*\./, 'Password must include at least one dot (.)'),
  serverAddress: Yup.string().url('Invalid URL'),
  serverPath: Yup.string(),
  port: Yup.number()
    .positive('Port must be a positive number')
    .integer('Port must be an integer')
    .min(1024, 'Port must be greater than or equal to 1024')
    .max(65535, 'Port must be less than or equal to 65535'),
});
const basicSchema = Yup.object().shape({
  username: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Required')
    .matches(/.*\./, 'Password must include at least one dot (.)'),
  serverAddress: Yup.string().url('Invalid URL'),
});
const FormikExample = () => {
  const onSubmit = (values: FormValues) => {
    let payload: FormValues = {
      username: values.username,
      password: values.password,
      serverAddress: values.serverAddress,
      accountType,
    };
    if (accountType === 'advanced') {
      payload = {...payload, serverPath: values.serverPath, port: values.port};
    }

    Alert.alert('JSON payload:', JSON.stringify(payload));
    Alert.alert('JSON payload submitted successfully!');
  };
  const [accountType, setAccountType] = useState<string>('advanced');

  const getValidationSchema = () => {
    return accountType === 'advanced' ? advancedSchema : basicSchema;
  };
  return (
    <NativeBaseProvider>
      <Formik<FormValues>
        initialValues={{
          username: '',
          password: '',
          serverAddress: '',
          serverPath: '',
          port: '',
          accountType,
          useSSL: true,
        }}
        validationSchema={getValidationSchema()}
        onSubmit={onSubmit}>
        {({values, handleChange, errors, handleSubmit, setFieldValue}) => (
          <VStack width="80%" mx="auto">
            <FormControl>
              <FormControl>

                <FormControl>
                <Box
                flexDirection="row"
                alignItems="center"
                justifyContent={'space-between'}>
              <FormControl.Label>Account Type</FormControl.Label>
              <Select
                selectedValue={accountType}
                minWidth="200"
                height="30"
                accessibilityLabel="Choose Account Type"
                placeholder="Choose Account Type"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={(nextValue) => setAccountType(nextValue)}
              >
                <Select.Item label="Advanced" value="advanced" />
                <Select.Item label="Manual" value="manual" /> 
              </Select>
              </Box>
            </FormControl>
               
              </FormControl>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.username}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent={'space-between'}>
                <FormControl.Label>Username:</FormControl.Label>
                <Input
                  id="username"
                  width={200}
                  height={30}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  onChangeText={handleChange('username')}
                  value={values.username}
                  style={styles.input}
                />
              </Box>
              <FormControl.ErrorMessage>
                {errors.username}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.password}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent={'space-between'}>
                <FormControl.Label>Password:</FormControl.Label>
                <Input
                  id="password"
                  width={200}
                  height={30}
                  placeholder="Required"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  style={styles.input}
                />
              </Box>
              <FormControl.ErrorMessage>
                {errors.password}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.serverAddress}>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent={'space-between'}>
                <FormControl.Label>Server Address</FormControl.Label>
                <Input
                  id="serverAddress"
                  width={200}
                  height={30}
                  placeholder="example.com"
                  onChangeText={handleChange('serverAddress')}
                  value={values.serverAddress}
                  style={styles.input}
                />
              </Box>
              <FormControl.ErrorMessage>
                {errors.serverAddress}
              </FormControl.ErrorMessage>
            </FormControl>
            {accountType === 'advanced' && (
              <>
                <FormControl isInvalid={!!errors.serverPath}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent={'space-between'}>
                    <FormControl.Label>Server Path</FormControl.Label>
                    <Input
                      id="serverPath"
                      width={200}
                      height={30}
                      placeholder="/calendar/users"
                      onChangeText={handleChange('serverPath')}
                      value={values.serverPath}
                      style={styles.input}
                    />
                  </Box>
                  <FormControl.ErrorMessage>
                    {errors.serverPath}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.port}>
                  <Box flexDirection="row" alignItems="center">
                    <FormControl.Label>Port</FormControl.Label>
                    <Input
                      id="port"
                      width={70}
                      height={30}
                      keyboardType="numeric"
                      onChangeText={handleChange('port')}
                      value={values.port}
                      style={styles.input}
                    />
                    <FormControl.Label>{'\t\t'}Use SSL</FormControl.Label>
                    <Checkbox
                      name="useSSL"
                      isChecked={values.useSSL}
                      onChange={() => setFieldValue('useSSL', !values.useSSL)}
                      value={''}
                    />
                  </Box>
                  <FormControl.ErrorMessage>
                    {errors.port}
                  </FormControl.ErrorMessage>
                </FormControl>
              </>
            )}
            <Center mt="4">
              <Button
                onPress={() => handleSubmit()}
                testID="Submit"
                disabled={
                  !!errors.username ||
                  !!errors.password ||
                  !!errors.serverAddress ||
                  !!errors.serverPath ||
                  !!errors.port
                }>
                Submit
              </Button>
            </Center>
          </VStack>
        )}
      </Formik>
    </NativeBaseProvider>
  );
};
export default FormikExample;
const styles = StyleSheet.create({
  input: {
    marginVertical: 10,
  },
});
