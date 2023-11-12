import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

// Validar la longitud del username
function validateUsername(username) {
    if (username.length < 5 || username.length > 15) {
        return {
            isValid: false,
            error: "El username debe tener entre 5 y 15 caracteres."
        };
    }
    return {
        isValid: true
    };
}

// Validar el formato del password
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{5,15}$/;
    if (!passwordRegex.test(password)) {
        return {
            isValid: false,
            error: "El password debe ser alfanumérico, contener al menos una letra mayúscula y tener entre 5 y 15 caracteres."
        };
    }
    return {
        isValid: true
    };
}

// Validar el formato del email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            error: "El mail debe tener una estructura de email válida."
        };
    }
    return {
        isValid: true
    };
}

export {
    validateUsername,
    validatePassword,
    validateEmail
};