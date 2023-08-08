import { BadRequestException, HttpException } from "@nestjs/common";

class Helpers {
  serviceResponseSuccess(data: any) {
    return {
      data,
      message: "Success",
    };
  }

  serviceError(error: any) {
    const keys = Object.keys(error);
    if (keys.indexOf("keyValue")) {
      throw new BadRequestException(JSON.stringify(error["keyValue"]));
    }
    if (error instanceof HttpException) {
      throw error;
    }
  }
}

const helpers = new Helpers();

export default helpers;
