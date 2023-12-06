

import { AuthenticationError, DeveloperError } from '@amaui/errors';

import { INext, IRequest, IResponse } from '../types';

const method = async (req: IRequest, res: IResponse, next: INext) => {
  try {
    // const amauiToken = (req.headers.authorization || req.query.amaui_token as string);

    // // Only if there's an amauiToken
    // if (amauiToken) {
    //   const value = verify(amauiToken, !!req.headers.authorization) as any;

    //   // Only pure values
    //   if (
    //     !value ||
    //     // versions
    //     // for other usage
    //     value.version &&
    //     (
    //       // mfa-app
    //       value.version === AUTH.token.version.mfa.app
    //     )
    //   ) throw new AuthenticationError(`Authentication is invalid`);

    //   // sign in
    //   // if active is false, throw an error
    //   const signIn = await SignIns.findOne({
    //     _id: new ObjectId(value.sign_in)
    //   });

    //   if (!signIn) throw new AuthenticationError(`Sign in not found`);

    //   if (!signIn.active) throw new AuthenticationError(`Sign in is inactive`);

    //   // user
    //   const user = await Users.findOne({
    //     _id: new ObjectId(signIn.user?.id)
    //   });

    //   if (!user) throw new AuthenticationError(`User not found`);

    //   if (!user.active) throw new AuthenticationError(`User is inactive`);

    //   // organization
    //   const organization = await Organizations.findOne({
    //     _id: new ObjectId(signIn.organization?.id)
    //   });

    //   if (!organization) throw new AuthenticationError(`Organization not found`);

    //   if (!organization.active) throw new AuthenticationError(`Organization is inactive`);

    //   const userOrganization = user.organizations?.find(userOrganization => userOrganization.id?.toString() === organization._id?.toString());

    //   if (!userOrganization) throw new AuthenticationError(`User organization not found`);

    //   if (!userOrganization.active) throw new AuthenticationError(`User is inactive in this organization`);

    //   // project
    //   const project = await Projects.findOne({
    //     _id: new ObjectId(signIn.project?.id),

    //     'organization.id': organization._id
    //   });

    //   if (!project) throw new AuthenticationError(`Project not found`);

    //   // organization plan
    //   const organizationPlan = await OrganizationPlans.findOne({
    //     'organization.id': organization._id
    //   });

    //   if (!organizationPlan) throw new DeveloperError(`Organization plan not found`);

    //   const apps = Object.keys(organizationPlan.plans);

    //   const plansIDs: Plan[] = apps.map(app => organizationPlan.plans[app]?.plan?.id);

    //   const plans = await Plans.aggregate([
    //     {
    //       $match: {
    //         _id: { $in: plansIDs }
    //       }
    //     }
    //   ]);

    //   // add
    //   // to organization plan
    //   apps.forEach(app => {
    //     const organizationPlanPlansApp = organizationPlan.plans[app];

    //     const plan = plans.find(item_ => item_._id.toString() === organizationPlanPlansApp.plan?.id?.toString());

    //     organizationPlanPlansApp.plan = plan;
    //   });

    //   // user groups
    //   const userGroups = await UserGroups.aggregate([
    //     {
    //       $match: {
    //         active: true,

    //         'users.id': user._id,

    //         'organization.id': organization._id
    //       }
    //     }
    //   ]);

    //   // permissions
    //   const permissionsOr = [
    //     // all
    //     {
    //       'for.organizations': {
    //         $elemMatch: {
    //           id: organization._id,
    //           all: true
    //         }
    //       }
    //     },

    //     // users
    //     {
    //       'for.organizations': {
    //         $elemMatch: {
    //           id: organization._id,
    //           'users.id': user._id
    //         }
    //       }
    //     },

    //     // user groups
    //     ...(!!userGroups.length ? [
    //       {
    //         'for.organizations': {
    //           $elemMatch: {
    //             id: organization._id,
    //             'userGroups.id': { $in: userGroups.map(item => item._id) }
    //           }
    //         }
    //       }
    //     ] : [])
    //   ];

    //   const permissions = await Permissions.aggregate([
    //     {
    //       $match: {
    //         $or: [
    //           // amaui
    //           {
    //             active: true,

    //             allowed: { $in: [PERMISSION_VALUES.amaui] },

    //             $or: permissionsOr
    //           },

    //           // organization
    //           // project
    //           {
    //             active: true,

    //             'organization.id': organization._id,

    //             'project.id': project._id,

    //             $or: permissionsOr
    //           }
    //         ]
    //       }
    //     }
    //   ]);

    //   // Add
    //   // user
    //   // organization
    //   user.organization = organization;

    //   // project
    //   user.project = project;

    //   // user groups
    //   user.userGroups = userGroups;

    //   // permissions
    //   user.permissions = permissions;

    //   // organizationPlan
    //   user.organizationPlan = organizationPlan;

    //   let projects: Project[] = [];

    //   if (user.is.admin) projects = await Projects.aggregate([
    //     {
    //       $match: {
    //         'organization.id': organization._id
    //       }
    //     }
    //   ]);
    //   else {
    //     const permissionsProjects = await Permissions.aggregate([
    //       {
    //         $match: {
    //           active: true,

    //           allowed: PERMISSION_VALUES.project,

    //           'organization.id': organization._id
    //         }
    //       }
    //     ]);

    //     if (!!permissionsProjects.length) {
    //       const project_ids = permissionsProjects.map(item => item.project.id);

    //       projects = await Projects.aggregate([
    //         {
    //           $match: {
    //             _id: { $in: project_ids },

    //             'organization.id': organization._id
    //           }
    //         }
    //       ]);
    //     }
    //   }

    //   // projects
    //   user.projects = projects;

    //   // if regular user
    //   // and no access to the project
    //   // auth error
    //   if (!user.is.admin && !user.is.project) throw new AuthenticationError(`No access to the project`);

    //   // request
    //   // user
    //   req.user = user;

    //   // organization
    //   req.organization = organization;

    //   // project
    //   req.project = project;

    //   // organizationPlan
    //   req.organizationPlan = organizationPlan;

    //   // signIn
    //   req.signIn = signIn;
    // }

    return next();
  }
  catch (error) {
    next(error);
  }
};

export default method;
