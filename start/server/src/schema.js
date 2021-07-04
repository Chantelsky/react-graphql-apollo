const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    # returns an array of all upcoming Launches
    launches: [Launch]!
    # returns a single Launch that corresponds with the id argument provided to the query
    launch(id: ID!): Launch
    #returns the details for the User thats currently logged in
    me: User
  }
  type Mutation {
    # if false, signup failed
    bookTrips(launchId: [ID]!): TripUpdateResponse!

    #enables a logged-in user to cancel a trip they previously booked
    cancelTrip(launchId: ID!): TripUpdateResponse!

    # enables a user to login by providing their email address
    login(email: String): User
  }

  # contains a success status, a corresponding message and an array of Launches
  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }
  type Rocket {
    id: ID!
    name: String
    type: String
  }
  type User {
    id: ID!
    email: String!
    trips: [Launch]!
    token: String
  }
  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }
  enum PatchSize {
    SMALL
    LARGE
  }
`;

module.exports = typeDefs;
