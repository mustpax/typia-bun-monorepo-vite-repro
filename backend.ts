import * as __typia_transform__validateReport from "typia/lib/internal/_validateReport.js";
import type { AppState } from "common";
import { validateEquals } from "typia";
import { exampleAppState } from "common";

console.log(
  (() => {
    const _io0 = (input: any, _exceptionable: boolean = true): boolean =>
      Array.isArray(input.tasks) &&
      input.tasks.every(
        (elem: any, _index1: number) =>
          "object" === typeof elem &&
          null !== elem &&
          _io1(elem, true && _exceptionable)
      ) &&
      (1 === Object.keys(input).length ||
        Object.keys(input).every((key: any) => {
          if (["tasks"].some((prop: any) => key === prop)) return true;
          const value = input[key];
          if (undefined === value) return true;
          return false;
        }));
    const _io1 = (input: any, _exceptionable: boolean = true): boolean =>
      "string" === typeof input.id &&
      (null === input.name || "string" === typeof input.name) &&
      (2 === Object.keys(input).length ||
        Object.keys(input).every((key: any) => {
          if (["id", "name"].some((prop: any) => key === prop)) return true;
          const value = input[key];
          if (undefined === value) return true;
          return false;
        }));
    const _vo0 = (
      input: any,
      _path: string,
      _exceptionable: boolean = true
    ): boolean =>
      [
        ((Array.isArray(input.tasks) ||
          _report(_exceptionable, {
            path: _path + ".tasks",
            expected: "Array<__type>",
            value: input.tasks,
          })) &&
          input.tasks
            .map(
              (elem: any, _index2: number) =>
                ((("object" === typeof elem && null !== elem) ||
                  _report(_exceptionable, {
                    path: _path + ".tasks[" + _index2 + "]",
                    expected: "__type",
                    value: elem,
                  })) &&
                  _vo1(
                    elem,
                    _path + ".tasks[" + _index2 + "]",
                    true && _exceptionable
                  )) ||
                _report(_exceptionable, {
                  path: _path + ".tasks[" + _index2 + "]",
                  expected: "__type",
                  value: elem,
                })
            )
            .every((flag: boolean) => flag)) ||
          _report(_exceptionable, {
            path: _path + ".tasks",
            expected: "Array<__type>",
            value: input.tasks,
          }),
        1 === Object.keys(input).length ||
          false === _exceptionable ||
          Object.keys(input)
            .map((key: any) => {
              if (["tasks"].some((prop: any) => key === prop)) return true;
              const value = input[key];
              if (undefined === value) return true;
              return _report(_exceptionable, {
                path:
                  _path +
                  __typia_transform__accessExpressionAsString._accessExpressionAsString(
                    key
                  ),
                expected: "undefined",
                value: value,
              });
            })
            .every((flag: boolean) => flag),
      ].every((flag: boolean) => flag);
    const _vo1 = (
      input: any,
      _path: string,
      _exceptionable: boolean = true
    ): boolean =>
      [
        "string" === typeof input.id ||
          _report(_exceptionable, {
            path: _path + ".id",
            expected: "string",
            value: input.id,
          }),
        null === input.name ||
          "string" === typeof input.name ||
          _report(_exceptionable, {
            path: _path + ".name",
            expected: "(null | string)",
            value: input.name,
          }),
        2 === Object.keys(input).length ||
          false === _exceptionable ||
          Object.keys(input)
            .map((key: any) => {
              if (["id", "name"].some((prop: any) => key === prop)) return true;
              const value = input[key];
              if (undefined === value) return true;
              return _report(_exceptionable, {
                path:
                  _path +
                  __typia_transform__accessExpressionAsString._accessExpressionAsString(
                    key
                  ),
                expected: "undefined",
                value: value,
              });
            })
            .every((flag: boolean) => flag),
      ].every((flag: boolean) => flag);
    const __is = (
      input: any,
      _exceptionable: boolean = true
    ): input is AppState =>
      "object" === typeof input && null !== input && _io0(input, true);
    let errors: any;
    let _report: any;
    return (input: any): import("typia").IValidation<AppState> => {
      if (false === __is(input)) {
        errors = [];
        _report = (__typia_transform__validateReport._validateReport as any)(
          errors
        );
        ((input: any, _path: string, _exceptionable: boolean = true) =>
          ((("object" === typeof input && null !== input) ||
            _report(true, {
              path: _path + "",
              expected: "AppState",
              value: input,
            })) &&
            _vo0(input, _path + "", true)) ||
          _report(true, {
            path: _path + "",
            expected: "AppState",
            value: input,
          }))(input, "$input", true);
        const success = 0 === errors.length;
        return success
          ? {
              success,
              data: input,
            }
          : ({
              success,
              errors,
              data: input,
            } as any);
      }
      return {
        success: true,
        data: input,
      } as any;
    };
  })()(exampleAppState)
);
