import {loadData, getHabits} from './dataManager.js';

const page = {
    menu: document.querySelector('.menu__items'),
    header : {
        h1: document.querySelector('.header__title'),
        progressPercent: document.querySelector('.progress__percent'),
        progressBar: document.querySelector('.progress__fill'),
    },
    content: {
        cards: document.querySelector('.cards'),
        card: document.querySelector('.card'),
    }
};

let habits;

(async () => {
    await loadData();
    habits = getHabits();
    rerender(habits[0].id);
})();


function rerenderMenu(activeHabit) {
    if (!activeHabit) {
        return;
    }

    for (const habit of habits) {
        let existed = document.querySelector(`[menu-habit-id="${habit.id}"]`);
        if (!existed) {
            const element = document.createElement('button');
            element.setAttribute('menu-habit-id', habit.id);
            element.classList.add('menu__item');
            element.innerHTML = `<img src="img/${habit.icon}.svg" alt="${habit.name}"/>`;
            element.addEventListener('click', () => rerender(habit.id));

            page.menu.appendChild(element);
            existed = element;
        }


        if (habit.id === activeHabit.id) {
            existed.classList.add('menu__item__active');
            existed.classList.remove('menu__item__not-active');
        } else {
            existed.classList.remove('menu__item__active');
            existed.classList.add('menu__item__not-active');

        }
    }
}

function rerenderHead(activeHabit) {
   if (!activeHabit) {
       return;
   }
   page.header.h1.innerText = activeHabit.name;
   const percent = activeHabit.days.length / activeHabit.target > 1 ? 100
       : activeHabit.days.length /  activeHabit.target * 100;
   page.header.progressPercent.innerText = `${percent}%`;
   page.header.progressBar
       .setAttribute('style', `width: ${percent}%`);
}

function rerenderBody(activeHabit) {
    if (!activeHabit) {
        return;
    }
    page.content.cards.innerHTML = "";
    for (const [index, el] of activeHabit.days.entries()) {
        const element = document.createElement('div');
        element.classList.add('card');
        element.innerHTML = `
                    <div class="card__number">Day ${index + 1}</div>
                    <div class="card__description">${el.description}</div>
                    <button class="card__delete">
                        <img src="img/shape.svg" alt="delete"/>
                    </button>`;
        page.content.cards.appendChild(element);
    }
    const formElement = document.createElement('div');
    formElement.classList.add('card');
    formElement.innerHTML = `
                    <div class="card__number">Day ${activeHabit.days.length + 1}</div>
                    <form class="card__form">
                        <input type="text" placeholder="Input your text" class="card__input"/>
                        <img src="img/comment.svg" alt="comment" class="card__comment__img"/>
                        <button type="submit" class="card__form_button">Add</button>
                    </form>`;
    page.content.cards.appendChild(formElement);
}

function rerender(activeHabitId) {
    const activeHabit = habits.find(habit => habit.id === activeHabitId);
    rerenderMenu(activeHabit);
    rerenderHead(activeHabit);
    rerenderBody(activeHabit);
}
