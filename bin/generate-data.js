const { writeFileSync } = require('node:fs');
const path = require('node:path');
const { faker } = require('@faker-js/faker');


function createRandomUser() {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    firstName,
    lastName,
    sex,
    subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business']),
  };
}

const ALL_USERS = [].constructor(1000).fill('').map(() => {
  return createRandomUser();
});

console.log('writing users to ', path.join(__dirname, '..', 'src', 'assets', 'users.json'));
writeFileSync( 
  path.join(__dirname, '..', 'src', 'assets', 'users.json'), 
  JSON.stringify(ALL_USERS), 
  'utf8' 
);

