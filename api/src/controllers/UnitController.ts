import {
  Body, Get, Put, Delete, Param, JsonController, UseBefore, NotFoundError, BadRequestError, Post,
  Authorized
} from 'routing-controllers';
import passportJwtMiddleware from '../security/passportJwtMiddleware';

import {Lecture} from '../models/Lecture';
import {IUnitModel, Unit} from '../models/units/Unit';
import {ValidationError} from 'mongoose';

@JsonController('/units')
@UseBefore(passportJwtMiddleware)
export class UnitController {

  @Get('/:id')
  getUnit(@Param('id') id: string) {
    return Unit.findById(id)
    .then((u) => u.toObject());
  }

  @Authorized(['teacher', 'admin'])
  @Post('/')
  addUnit(@Body() data: any) {
    // discard invalid requests
    this.checkPostParam(data);

    return Unit.create(data.model)
    .then((createdUnit) => {
      return this.pushToLecture(data.lectureId, createdUnit);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw err;
      } else {
        throw new BadRequestError(err);
      }
    });
  }

  @Authorized(['teacher', 'admin'])
  @Put('/:id')
  async updateUnit(@Param('id') id: string, @Body() data: any) {
    const oldUnit: IUnitModel = await Unit.findById(id);

    if (!oldUnit) {
      throw new NotFoundError();
    }

    try {
      oldUnit.set(data);
      const updatedUnit: IUnitModel = await oldUnit.save();
      return updatedUnit.toObject();
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw err;
      } else {
        throw new BadRequestError(err);
      }
    }
  }

  @Authorized(['teacher', 'admin'])
  @Delete('/:id')
  deleteUnit(@Param('id') id: string) {
    return Unit.findById(id).then((unit) => {
      if (!unit) {
        throw new NotFoundError();
      }

      return Lecture.update({}, {$pull: {units: id}})
        .then(() => unit.remove())
        .then(() => {
          return {result: true};
        });
    });
  }

  protected pushToLecture(lectureId: string, unit: any) {
    return Lecture.findById(lectureId)
      .then((lecture) => {
        lecture.units.push(unit);
        return lecture.save();
      })
      .then(() => {
        return unit.populateUnit();
      })
      .then((populatedUnit) => {
        return populatedUnit.toObject();
      })
      .catch((err) => {
        throw new BadRequestError(err);
      });
  }

  protected checkPostParam(data: any) {
    if (!data.lectureId) {
      throw new BadRequestError('No lecture ID was submitted.');
    }

    if (!data.model) {
      throw new BadRequestError('No unit was submitted.');
    }

    if (!data.model._course) {
      throw new BadRequestError('Unit has no _course set');
    }
  }
}
