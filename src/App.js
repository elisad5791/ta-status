import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './scss/App.scss';
import data from './data/cities.json';

function App() {
  const [cities, setCities] = useState([]);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(''); 

  useEffect(() => {
    const filteredData = data
      .filter((item) => item.population > 50000)
      .sort((a, b) => {
        if (a.city > b.city) {
          return 1;
        }
        if (a.city < b.city) {
          return -1;
        }
        return 0;
      });
    const [index] = filteredData
      .reduce((acc, item, i) => Number(item.population) > acc[1] ? [i, item.population] : acc, [0, 0]);
    const processedData = [filteredData[index], ...filteredData.slice(0, index), ...filteredData.slice(index + 1)]
      .map((item) => item.city);
    setCities(processedData);
  }, []);

  const handleClick = () => {
    setShow(true);
  };

  const formik = useFormik({
    initialValues: {
      status: 'Прежде чем действовать, надо понять',
      city: 'Красноярск',
      password: '',
      password2: '',
      email: '',
      accept: false,
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Укажите пароль')
        .min(5, 'Используйте не менее 5 символов'),
      password2: Yup.string()
        .required('Укажите пароль')
        .oneOf([Yup.ref('password'), null], 'Пароли не совпадают'),
      email: Yup.string()
        .required('Укажите E-mail')
        .email('Неверный E-mail'),
    }),
    onSubmit: values => {
      console.log(JSON.stringify(values, null, 2));
      const date = new Date();
      const optionsDate = {
        month: 'long',
        day: 'numeric',
      };
      const  optionsTime = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      const year = date.getFullYear();
      const formattedDate = date.toLocaleString("ru", optionsDate);
      const formattedTime = date.toLocaleString("ru", optionsTime);
      const fullDate = `${formattedDate} ${year} в ${formattedTime}`;
      setDate(fullDate);
    },
  });

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <p className="form__hello">Здравствуйте, <span className="form__user">Человек №3596941</span></p>
      <div className="form__status">
        {formik.values.status}
        <div className="form__arrow"></div>
      </div>
      { !show &&
        <button type="button" className="form__change" onClick={handleClick}>Сменить статус</button>
      }
      <fieldset className="form__group">
        { show &&
          <div className="form__wrapper">
            <label htmlFor="status" className="form__label">Ваш новый статус</label>
            <input 
              type="text" 
              name="status" 
              id="status" 
              className="form__control" 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}  
            />
          </div>
        }
        <div className="form__wrapper">
          <label htmlFor="city" className="form__label">Ваш город</label>
          <select 
            name="city" 
            id="city" 
            className="form__control"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
          >
            {cities.map((city) => <option key={city}>{city}</option>)}
          </select>
        </div>
      </fieldset>
      <fieldset className="form__group">
        <div className="form__wrapper">
          <label htmlFor="password" className="form__label">Пароль</label>
          <div className="form__wrapper-inner">
            <div>
              <input 
                type="password" 
                name="password" 
                id="password" 
                className="form__control" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="form__error">{formik.errors.password}</div>
              ) : null}
            </div>
            <p className="form__text">Ваш новый пароль должен содержать не менее 5 символов.</p>
          </div>
        </div>
        <div className="form__wrapper">
          <label htmlFor="password2" className="form__label">Пароль еще раз</label>
          <div className="form__wrapper-inner">
            <div>
              <input 
                type="password2" 
                name="password2" 
                id="password2" 
                className="form__control" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password2}
              />
              {formik.touched.password2 && formik.errors.password2 ? (
                  <div className="form__error">{formik.errors.password2}</div>
              ) : null}
            </div>
            <p className="form__text">Повторите пароль, пожалуйста, это обезопасит вас с нами на случай ошибки.</p>
          </div>
        </div>
      </fieldset>
      <fieldset className="form__group form__group--no-border">
        <div className="form__wrapper">
          <label htmlFor="email" className="form__label">Электронная почта</label>
          <div className="form__wrapper-inner">
            <div>
              <input 
                type="email" 
                name="email" 
                id="email" 
                className="form__control" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                  <div className="form__error">{formik.errors.email}</div>
              ) : null}
            </div>
            <p className="form__text">Можно изменить адрес, указанный при регистрации.</p>
          </div>
        </div>
        <div className="form__wrapper">
          <label htmlFor="accept" className="form__label">Я согласен</label>
          <div>
            <input 
              type="checkbox" 
              name="accept" 
              id="accept" 
              className="form__checkbox" 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.accept}
            />
            <span className="form_comment">принимать актуальную информацию на емейл</span>
          </div>
        </div>
      </fieldset>
      <div className="form__wrapper form__wrapper--last">
        <div className="form__button-box">
          <button type="submit" className="form__submit">Изменить</button>
          {date && <p className="form__text">последние изменения {date}</p>}
        </div>
      </div>
    </form>
  );
}

export default App;
