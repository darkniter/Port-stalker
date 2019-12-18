import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, list } from "./generic-load";

const Loader = () => (
  <Section>
    <Title>Loading</Title>
    {
      <Article key={list[3].prop}>
        <ReactLoading type={list[3].prop} color="#000" />

      </Article>
    }
  </Section>
);

export default Loader;
