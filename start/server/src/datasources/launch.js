const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  /**
   *  transforms launch data from REST API into this schema-defined shape
   */
  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }

  async getAllLaunches() {
    /**
     * sends a GET request to the API /v2/launches and stores the array
     **/
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : [];
  }

  /**
   * takes a launch's flight number and returns the data for the associated launch.
   */
  async getLaunchById({ launchId }) {
    const response = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(res[0]);
  }

  /**
   * returns the result of multiple calls to getLaunchById
   */
  async getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId }))
    );
  }
}

module.exports = LaunchAPI;
