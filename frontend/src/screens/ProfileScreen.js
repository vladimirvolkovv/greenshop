import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают!');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user]);

  return (
    <Row>
      <Col md={3}>
        <h1>Профиль</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Профиль обновлен!</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Ваше Имя</Form.Label>
            <Form.Control
              type='name'
              placeholder='Введите Ваше Имя'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Адрес электронной почты</Form.Label>
            <Form.Control
              type='email'
              placeholder='Введите адрес email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type='password'
              placeholder='Введите пароль'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirmPassword'>
            <Form.Label>Введите пароль ещё раз</Form.Label>
            <Form.Control
              type='password'
              placeholder='Введите пароль ещё раз'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button className='mt-3' type='submit' variant='primary'>
            Обновить информацию
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>Мои заказы</h2>
      </Col>
    </Row>

    // <FormContainer>
    //   <h1>Регистрация</h1>
    //   {message && <Message variant='danger'>{message}</Message>}
    //   {error && <Message variant='danger'>{error}</Message>}
    //   {loading && <Loader />}
    //   <Form onSubmit={submitHandler}>
    //     <Form.Group controlId='name'>
    //       <Form.Label>Ваше Имя</Form.Label>
    //       <Form.Control
    //         type='name'
    //         placeholder='Введите Ваше Имя'
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group controlId='email'>
    //       <Form.Label>Адрес электронной почты</Form.Label>
    //       <Form.Control
    //         type='email'
    //         placeholder='Введите адрес email'
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group controlId='password'>
    //       <Form.Label>Пароль</Form.Label>
    //       <Form.Control
    //         type='password'
    //         placeholder='Введите пароль'
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Form.Group controlId='confirmPassword'>
    //       <Form.Label>Введите пароль ещё раз</Form.Label>
    //       <Form.Control
    //         type='password'
    //         placeholder='Введите пароль ещё раз'
    //         value={confirmPassword}
    //         onChange={(e) => setConfirmPassword(e.target.value)}
    //       ></Form.Control>
    //     </Form.Group>
    //     <Button className='mt-3' type='submit' variant='primary'>
    //       Зарегистрироваться
    //     </Button>
    //   </Form>
    //   <Row className='py-3'>
    //     <Col>
    //       Уже есть учетная запись?
    //       <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Вход</Link>
    //     </Col>
    //   </Row>
    // </FormContainer>
  );
};

export default ProfileScreen;
