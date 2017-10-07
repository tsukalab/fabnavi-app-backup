// ProjectCard.test.js
import React from 'react';
import ProjectCard from './ProjectCard';
import renderer from 'react-test-renderer';

test('ProjectCard changes the class when hovered', () => {

    const project = {
        id: 100,
        name: 'sample',
        description: 'this is sample project',
        user: {
            image: 'https://avatars0.githubusercontent.com/u/12455918?v=4'
        }
    }
    const component = renderer.create(
        <ProjectCard {...project} toggleMenu={()=>{}} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});