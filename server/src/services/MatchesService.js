import mongoose from "mongoose"
import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { playersService } from "./PlayersService.js"
import { tournamentsService } from "./TournamentsService.js"

class MatchesService {
  async createBracketForTournament(tournamentId) {
    const players = await playersService.getPlayersByTournamentId(tournamentId)
    const numOfPlayers = players.length
    const totalRounds = await this.calculateRounds(numOfPlayers)
    const matches = await this.createMatches(totalRounds)
    const populatedTournament = await this.populateMatches(matches, players)
    const byeCheckedTournament = await this.reportByeMatches(populatedTournament, totalRounds)
    return byeCheckedTournament
  }


  async reportByeMatches(matches, rounds) {
    const matchesWithByes = matches.filter(m => m.bye2 == true)
    const nextRoundMatches = matches.filter(m => m.roundNumber == rounds - 1)
    for (let i = 0; i < matchesWithByes.length; i++) {
      const nextMatch = nextRoundMatches.filter(m => m.id == matchesWithByes[i].nextId)
      matchesWithByes[i].winnerId = matchesWithByes[i].player1Id
      nextMatch[0].player1Id = matchesWithByes[i].winnerId

    }
    return matches
  }

  async populateMatches(matches, participants) {

    const liveMatches = matches.filter(m => m.seedPosition1 != '' && m.seedPosition2 != '')
    liveMatches.forEach(m => {
      if (m.seedPosition1 > participants.length) {
        m.bye1 = true
      }
      if (m.seedPosition2 > participants.length) {
        m.bye2 = true
      }
      if (m.bye1 == false) {

        m.player1Id = participants[m.seedPosition1 - 1].accountId
      }
      if (m.bye2 == false) {

        m.player2Id = participants[m.seedPosition2 - 1].accountId
      }


    });
    return matches

  }




  createMatches(totalRounds) {

    function Match(round, nextId, boutNum) {
      this.id = new mongoose.Types.ObjectId() || ''
      this.player1Id = ''
      this.player2Id = ''
      this.roundNumber = round
      this.boutNum = boutNum
      this.bye1 = false
      this.bye2 = false
      this.winnerId = ''
      this.tournamentId = ''
      this.nextId = nextId
      this.seedPosition1 = ''
      this.seedPosition2 = ''
    }



    let matches = []
    let matchIds = []

    for (let i = 0; i < totalRounds; i++) {
      let boutNum = (2 ** totalRounds) - 1
      let loopNum = i
      if (loopNum == 1) {
        loopNum = 2
      }
      if (loopNum == 0) {
        loopNum = 1
      }
      if (i > 1) {
        loopNum = 2 ** loopNum
      }

      for (let b = 0; b < loopNum; b++) {
        let newBoutNum = boutNum - matches.length
        const matchId = matchIds[0]
        const match = new Match(i + 1, matchId, newBoutNum)
        if (matchIds.length > 0) {
          matchIds.shift()
        }
        matchIds.push(match.id)
        matchIds.push(match.id)
        matches.push(match)
      }
    }
    let num = 0
    let seedArray = []
    let newArray = []

    for (let i = 0; i < (2 ** totalRounds); i++) {
      const newNum = num + (i + 1)
      seedArray.push(newNum.toString())
    }

    for (let i = 0; i <= (totalRounds - 1); i++) {
      newArray = []
      const timesThrough = seedArray.length / 2
      for (let b = 0; b < (timesThrough); b++) {
        const newValue = seedArray[0] + ' ' + seedArray[seedArray.length - 1]
        newArray.push(newValue)
        seedArray.shift()
        seedArray.pop()
      }
      seedArray = newArray
    }
    const seedString = seedArray.toString()
    const newSeedArray = seedString.split(' ')

    const myMatches = matches.filter(m => m.roundNumber == totalRounds)

    for (let i = 0; i < myMatches.length; i++) {
      myMatches[i].seedPosition1 = newSeedArray[0]
      myMatches[i].seedPosition2 = newSeedArray[1]
      newSeedArray.shift()
      newSeedArray.shift()

    }
    return matches
  }



  calculateRoundTwos(participants) {
    const originalNum = Math.trunc(Math.log2(participants))
    const num = (2 ** originalNum) * 2
    const roundTwos = num - participants
    return roundTwos
  }

  calculateRoundOnes(participants) {
    const originalNum = Math.trunc(Math.log2(participants))
    const roundOnes = participants - (2 ** originalNum)
    return roundOnes
  }

  calculateRounds(participants) {

    return Math.ceil(Math.log2(participants));
  }
  async getMatches() {
    const matches = await dbContext.Matches.find()
    return matches
  }
  async getMatchesByTournament(tournamentId) {
    const tournament = await tournamentsService.getTournamentById(tournamentId)
    const matches = await dbContext.Matches.find({ tournamentId: tournament.id })
    return matches
  }
  async getMatchById(matchId) {
    const match = await dbContext.Matches.findById(matchId)
    if (!match) {
      throw new BadRequest(`${matchId} is not a valid ID`)
    }
    return match
  }
  async getMatchesByPlayer(playerId) {
    const player = await playersService.getPlayerById(playerId)
    if (!player) {
      throw new BadRequest(`${playerId} is not a valid player id`)
    }
    const matches = await dbContext.Matches.find({ $or: [{ player1Id: playerId }, { player2Id: playerId }] })
    return matches
  }

  async getMatchesByWinnerId(winnerId) {
    const player = playersService.getPlayerById(winnerId)
    if (!player) {
      throw new BadRequest(`${winnerId} is not a valid player id`)
    }
    const matches = await dbContext.Matches.find({ winnerId })
    return matches
  }

  async createMatch(matchData, userId) {
    const tournament = await tournamentsService.getTournamentById(matchData.tournamentId)
    if (tournament.creatorId != userId) {
      throw new Forbidden(`You can't create a match for a tournament you don't own`)
    }
    const newMatch = await dbContext.Matches.create(matchData)
    return newMatch
  }

  async updateMatch(match, userId) {
    const foundMatch = await this.getMatchById(match.id)
    const tournament = await tournamentsService.getTournamentById(foundMatch.tournamentId)
    if (tournament.creatorId != userId) {
      throw new Forbidden(`You cannot edit a match for a tournament you do not own`)
    }
    foundMatch.player1Id = match.player1Id
    foundMatch.player2Id = match.player2Id
    foundMatch.roundNumber = match.roundNumber
    foundMatch.winnerId = match.winnerId
    await foundMatch.save()
    return foundMatch
  }

  async destroyMatch(matchId, userId) {
    const match = await this.getMatchById(matchId)
    const tournament = await tournamentsService.getTournamentById(match.tournamentId)
    if (tournament.creatorId != userId) {
      throw new Forbidden(`You cannot destroy a match on a tournament that does not belong to you`)
    }
    const destroyedMatch = await dbContext.Matches.remove(match)
    return destroyedMatch
  }
}


export const matchesService = new MatchesService()