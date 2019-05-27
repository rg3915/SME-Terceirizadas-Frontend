import { API_URL } from '../constants/config.constants'

export const getWorkingDays = () => {
  const url = API_URL + `/working_days/`
  return fetch(url)
      .then(result => {
          return result.json()
      }).catch(error => {
          console.log(error);
      })
}