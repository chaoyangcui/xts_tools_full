/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class AsyncExpectService {
  constructor (attr) {
    this.id = attr.id
    this.matchers = {}
  }

  expectAsync (actualValue) {
    return this.wrapAsyncMatchers(actualValue)
  }

  addAsyncMatchers (matchers) {
    for (const matcherName in matchers) {
      this.matchers[matcherName] = matchers[matcherName]
    }
  }

  wrapAsyncMatchers (actualValue) {
    let _this = this

    const wrappedAsyncMatchers = {}
    const specService = _this.coreContext.getDefaultService('spec')
    const currentRunningSpec = specService.getCurrentRunningSpec()
    for (const matcherName in this.matchers) {
      wrappedAsyncMatchers[matcherName] = function () {
        _this.matchers[matcherName](actualValue, arguments).then(
          function (result) {
            console.info('result test')
            result.actualValue = actualValue
            result.checkFunc = matcherName
            currentRunningSpec.addExpectationResult(result)
          }
        )
      }
    }
    return wrappedAsyncMatchers
  }

  apis () {
    let _this = this
    return {
      expectAsync: function (actualValue) {
        return _this.expectAsync(actualValue)
      }
    }
  }
}

export default AsyncExpectService
