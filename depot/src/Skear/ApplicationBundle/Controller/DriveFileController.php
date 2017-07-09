<?php

namespace Skear\ApplicationBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Skear\ApplicationBundle\Entity\DriveFile;
use Skear\ApplicationBundle\Form\DriveFileType;

class DriveFileController extends Controller
{
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $drivefiles = $em->getRepository('SkearApplicationBundle:DriveFile')->findAll();

        $newFile= new Drivefile();
        $form = $this->createForm('Skear\ApplicationBundle\Form\DriveFileType', $newFile);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($newFile);
            $em->flush($newFile);

            return $this->redirectToRoute('skear_drive_file');
        }

        //$deleteForm = $this->createDeleteForm($drivefiles);

        return $this->render('SkearApplicationBundle:Drivefile:index.html.twig', array(
            'drivefiles' => $drivefiles,
            'newFile' => $newFile,
            'form' => $form->createView(),
            //'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Finds and displays a driveFile entity.
     *
     */
    public function showAction(DriveFile $driveFile)
    {
        $deleteForm = $this->createDeleteForm($driveFile);

        return $this->render('SkearApplicationBundle:Drivefile:show.html.twig', array(
            'driveFile' => $driveFile,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a driveFile entity.
     *
     */
    public function deleteAction(Request $request, DriveFile $driveFile)
    {
        $form = $this->createDeleteForm($driveFile);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($driveFile);
            $em->flush($driveFile);
        }

        return $this->redirectToRoute('skear_drive_file');
    }

    /**
     * Creates a form to delete a driveFile entity.
     *
     * @param DriveFile $driveFile The driveFile entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(DriveFile $driveFile)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('file_delete', array('id' => $driveFile->getId())))
            ->setMethod('DELETE')
            ->getForm()
            ;
    }

    public function ajaxSnippetImageSendAction(Request $request)
    {
        $em = $this->container->get("doctrine.orm.default_entity_manager");

        $document = new DriveFile();
        $media = $request->files->get('file');

        $document->file = $media;
        //$document->setPath($media->getPathName());
        $document->setTitle($media->getClientOriginalName());
        $document->upload();
        $em->persist($document);
        $em->flush();

        //infos sur le document envoyé
        //var_dump($request->files->get('file'));die;
        return new JsonResponse(array('success' => true));
    }
}
