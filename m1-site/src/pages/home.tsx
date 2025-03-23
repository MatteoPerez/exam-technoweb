import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './home.module.css'

export default function Home() {
  return (
    <div className={Styles.homePage}>
      <h1>Welcome to the Library ! </h1>
      <p>I am the home page</p>
      <h1>UWU</h1>
      <p>I know... I'm a bit useless :'( </p>
    </div>
  );
}