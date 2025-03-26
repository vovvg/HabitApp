import { loadData, getHabits, saveData } from './dataManager.js';

const page = {
    menu: document.querySelector('.menu__items'),
    header: {
        h1: document.querySelector('.header__title'),
        progressPercent: document.querySelector('.progress__percent'),
        progressBar: document.querySelector('.progress__fill'),
    },
    content: {
        cards: document.getElementById('cards'),
        card: document.querySelector('.card'),
    },
    popup: {
        popup: document.querySelector('.popup'),
        cover: document.querySelector('.cover'),
        icons: document.querySelectorAll('.icon'),
        addButton: document.querySelector(".menu__item_add"),
        closeButton: document.querySelector('.popup__close'),
        form: document.querySelector(".popup__form"),
    }
};

let habits = [];

(async () => {
    await loadData();
    habits = getHabits();
    rerender(habits[0]?.id || null);
    setupPopupEvents();
})();

function setupPopupEvents() {
    page.popup.addButton.addEventListener('click', () => {
        page.popup.cover.classList.remove('cover__hidden');
    });

    page.popup.closeButton.addEventListener('click', () => {
        page.popup.cover.classList.add('cover__hidden');
    });

    let selectedIcon = "sport";

    page.popup.icons.forEach(icon => {
        icon.addEventListener("click", () => {
            page.popup.icons.forEach(i => i.classList.remove("icon__active"));
            icon.classList.add("icon__active");
            selectedIcon = icon.querySelector("img").src.split("/").pop().split(".")[0];
        });
    });

    page.popup.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = page.popup.form.querySelector('input[name="name"]');
        const targetInput = page.popup.form.querySelector('input[name="target"]');
        const name = nameInput.value.trim();
        const target = parseInt(targetInput.value, 10);

        if (!name || isNaN(target) || target <= 0) {
            alert("Введите корректные данные!");
            return;
        }

        const newHabit = {
            id: Date.now(),
            name,
            target,
            icon: selectedIcon,
            days: []
        };

        habits.push(newHabit);
        saveData();
        rerender(newHabit.id);

        page.popup.cover.classList.add("cover__hidden");
        page.popup.form.reset();
    });
}

function rerenderMenu(activeHabit) {
    page.menu.innerHTML = "";

    habits.forEach(habit => {
        const element = document.createElement('button');
        element.setAttribute('menu-habit-id', habit.id);
        element.classList.add('menu__item');
        element.innerHTML = `<img src="img/${habit.icon}.svg" alt="${habit.name}"/>`;
        element.addEventListener('click', () => rerender(habit.id));

        if (habit.id === activeHabit.id) {
            element.classList.add('menu__item__active');
        }

        page.menu.appendChild(element);
    });
}

function rerenderHead(activeHabit) {
    if (!activeHabit) return;

    page.header.h1.innerText = activeHabit.name;
    const percent = Math.min(100, (activeHabit.days.length / activeHabit.target) * 100);
    page.header.progressPercent.innerText = `${percent.toFixed(0)}%`;
    page.header.progressBar.style.width = `${percent}%`;
}

function rerenderBody(activeHabit) {
    if (!activeHabit) return;

    page.content.cards.innerHTML = "";

    activeHabit.days.forEach((el, index) => {
        const element = document.createElement('div');
        element.classList.add('card');
        element.innerHTML = `
            <div class="card__number">Day ${index + 1}</div>
            <div class="card__description">${el.description}</div>
            <button class="card__delete">
                <img src="img/shape.svg" alt="delete"/>
            </button>`;
        element.querySelector('.card__delete').addEventListener('click', () => {
            activeHabit.days.splice(index, 1);
            saveData();
            rerender(activeHabit.id);
        });
        page.content.cards.appendChild(element);
    });

    addCardForm(activeHabit);
}

function addCardForm(activeHabit) {
    const formElement = document.createElement('div');
    formElement.classList.add('card');
    formElement.innerHTML = `
        <div class="card__number">Day ${activeHabit.days.length + 1}</div>
        <form class="card__form">
            <input type="text" placeholder="Input your text" class="card__input"/>
            <img src="img/comment.svg" alt="comment" class="card__comment__img"/>
            <button type="submit" class="card__form_button">Add</button>
        </form>`;

    const form = formElement.querySelector('.card__form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.card__input');
        const newDescription = input.value.trim();

        if (newDescription) {
            activeHabit.days.push({ description: newDescription });
            saveData();
            rerender(activeHabit.id);
        } else {
            input.classList.add('input_error');
        }

        input.value = "";
    });

    page.content.cards.appendChild(formElement);
}

function rerender(activeHabitId) {
    const activeHabit = habits.find(habit => habit.id === activeHabitId);

    if (!activeHabit) return;

    rerenderMenu(activeHabit);
    rerenderHead(activeHabit);
    rerenderBody(activeHabit);
}
