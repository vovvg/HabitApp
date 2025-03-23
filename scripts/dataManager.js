'use strict';

const HABBIT_KEY = 'HABBIT_KEY';
const DATA_URL = './data/test.json'; // путь к JSON-файлу

let habits = [];

export async function loadData() {
    try {
        // 1. Загружаем из localStorage
        const habitString = localStorage.getItem(HABBIT_KEY);
        if (habitString) {
            habits = JSON.parse(habitString);
            return;
        }

        // 2. Если данных нет – загружаем из JSON-файла
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки JSON: ${response.status}`);
        }

        habits = await response.json();
        saveData();

    } catch (error) {
        console.error('Ошибка в loadData:', error);
    }
}

export function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habits));
}

export function getHabits() {
    return habits;
}
