import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../db/firestore';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';

const CreateFood = () => {
    const navigation = useNavigation();
    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is required'),
        fat: yup.number().required('Fat is required').min(0),
        carbohydrate: yup.number().required('Carbohydrates are required').min(0),
        protein: yup.number().required('Protein is required').min(0),
        calories: yup.number().required('Calories are required').min(0),
    });

    const addFoodLog = async (values) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        const uid = user.uid;

        const parsedValues = {
            name: values.name,
            fat: parseFloat(values.fat),
            carbohydrate: parseFloat(values.carbohydrate),
            protein: parseFloat(values.protein),
            calories: parseFloat(values.calories),
            uid: uid
        };

        try {
            await addDoc(collection(db, 'customMeals'), parsedValues); // Add to customMeals with uid
            navigation.goBack();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.advisoryText}>
                Please create food entries based on accurate details for a portion.
            </Text>
            <Formik
                initialValues={{ name: '', fat: '', carbohydrate: '', protein: '', calories: '' }}
                onSubmit={addFoodLog}
                validationSchema={validationSchema}
            >
                {({ values, handleChange, errors, setFieldTouched, touched, handleSubmit }) => (
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('name')}
                            onBlur={() => setFieldTouched('name')}
                            placeholder={'Food Name'}
                            value={values.name}
                        />
                        {touched.name && errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('fat')}
                            onBlur={() => setFieldTouched('fat')}
                            placeholder={'Fat (g)'}
                            value={values.fat}
                            keyboardType='numeric'
                        />
                        {touched.fat && errors.fat ? <Text style={styles.errorText}>{errors.fat}</Text> : null}

                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('carbohydrate')}
                            onBlur={() => setFieldTouched('carbohydrate')}
                            placeholder={'Carbohydrate (g)'}
                            value={values.carbohydrate}
                            keyboardType='numeric'
                        />
                        {touched.carbohydrate && errors.carbohydrate ? <Text style={styles.errorText}>{errors.carbohydrate}</Text> : null}

                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('protein')}
                            onBlur={() => setFieldTouched('protein')}
                            placeholder={'Protein (g)'}
                            value={values.protein}
                            keyboardType='numeric'
                        />
                        {touched.protein && errors.protein ? <Text style={styles.errorText}>{errors.protein}</Text> : null}

                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('calories')}
                            onBlur={() => setFieldTouched('calories')}
                            placeholder={'Calories'}
                            value={values.calories}
                            keyboardType='numeric'
                        />
                        {touched.calories && errors.calories ? <Text style={styles.errorText}>{errors.calories}</Text> : null}

                        <Button title={'Create Food Log'} onPress={handleSubmit} />
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    advisoryText: {
        fontSize: 19,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        marginBottom: 10,
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginLeft: 5,
    },
});

export default CreateFood;
