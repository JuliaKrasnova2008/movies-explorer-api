const BadRequestText = 'Введены некорректные данные';
const serverErrorText = 'Сервер сейчас упадёт';
const serverNotFound = 'Порта не существует';

// movies
const movieNotFoundText = 'Фильм не найден';
const movieIdNotFoundText = 'Фильм с таким id не найден';
const movieForbiddenText = 'Запрещено удалять фильмы других пользователей';

// users
const usersConflictText = 'Пользователь с таким email уже существует';
const usersUnauthorizedText = 'Необходима авторизация';
const usersWrongLoginOrPasswordText = 'Не правильно указан логин или пароль';
const usersIdNotFoundText = 'Нет пользователя с таким id';

module.exports = {
  movieNotFoundText,
  movieIdNotFoundText,
  BadRequestText,
  movieForbiddenText,
  usersConflictText,
  usersUnauthorizedText,
  usersWrongLoginOrPasswordText,
  usersIdNotFoundText,
  serverErrorText,
  serverNotFound
};
